from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
import asyncio


class RoomConsumer(AsyncJsonWebsocketConsumer):
    rooms = {}
    rooms_lock = asyncio.Lock()

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user = self.scope["user"]
        self.channel_layer = get_channel_layer()
        # Join room group
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        # 방이 다 차있을 경우 에러 (code=4003)
        async with RoomConsumer.rooms_lock:
            if self.room_id not in RoomConsumer.rooms:
                RoomConsumer.rooms[self.room_id] = []
            RoomConsumer.rooms[self.room_id].append(self.user)
            if len(RoomConsumer.rooms[self.room_id]) >= 3:
                await self.channel_layer.group_discard(self.room_id, self.channel_name)
                RoomConsumer.rooms[self.room_id].remove(self.user)
                await self.close(code=4003)  # 임시 오류 코드
                return
        # 연결 수락
        await self.accept()
        # 연결 수락 시 방 참여 인원에게 방 인원 정보 전송
        await self.send_user_info()
        # 방 인원이 정원일 경우 3초뒤 소켓 연결 해제
        async with RoomConsumer.rooms_lock:
            if len(RoomConsumer.rooms[self.room_id]) == 2:
                await self.channel_layer.group_send(
                    self.room_id,
                    {
                        "type": "send_disconnect",
                        "room_id": self.room_id,
                    },
                )

    async def send_user_info(self):
        # 해당 방의 모든 사용자 정보를 수집하여 전송
        username_list = [user.username for user in RoomConsumer.rooms[self.room_id]]
        userimage_list = [str(user.image) for user in RoomConsumer.rooms[self.room_id]]
        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "broadcast_users",
                "username": username_list,
                "userimage": userimage_list,
            },
        )

    async def broadcast_users(self, event):
        # 모든 사용자에게 방에 있는 사용자 정보 전송
        username_list = event["username"]
        userimage_list = event["userimage"]
        user_data = {
            "type": "users",
        }
        for idx, username in enumerate(username_list, start=0):
            user_data[f"user{idx}"] = username
            user_data[f"user{idx}_image"] = userimage_list[idx]

        await self.send_json(user_data)

    async def send_disconnect(self, event):
        room_id = event["room_id"]
        data = {
            "type": "start_game",
            "room_id": room_id,
        }
        await self.send_json(data)

    async def disconnect(self, close_code):
        async with RoomConsumer.rooms_lock:
            if self.room_id in RoomConsumer.rooms:
                if self.user in RoomConsumer.rooms[self.room_id]:
                    RoomConsumer.rooms[self.room_id].remove(self.user)
                    # 방에 더 이상 참여자가 없으면 방을 삭제
                    if not RoomConsumer.rooms[self.room_id]:
                        del RoomConsumer.rooms[self.room_id]
        # Leave room group
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.close()
