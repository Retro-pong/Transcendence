from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
import asyncio
from backend.middleware import JWTAuthMiddleware
from channels.db import database_sync_to_async
from django.apps import apps
from django.utils import timezone


class RoomConsumer(AsyncJsonWebsocketConsumer):
    rooms = {}
    rooms_lock = asyncio.Lock()

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.channel_layer = get_channel_layer()
        # Join room group
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        # 연결 수락
        await self.accept()

    async def receive_json(self, content):
        if content["type"] == "access":
            token = content["token"]
            try:
                self.user = await JWTAuthMiddleware.get_user(token)
            except Exception as e:
                await self.send_json({"access": "User invalid or expired."})
                return
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
            else:
                await self.send_json({"access": "Access successful."})
            # 방이 다 차있을 경우 에러 (code=4003)
            async with RoomConsumer.rooms_lock:
                if self.room_id not in RoomConsumer.rooms:
                    RoomConsumer.rooms[self.room_id] = []
                RoomConsumer.rooms[self.room_id].append(self.user)
                if len(RoomConsumer.rooms[self.room_id]) >= 3:
                    await self.channel_layer.group_discard(
                        self.room_id, self.channel_name
                    )
                    RoomConsumer.rooms[self.room_id].remove(self.user)
                    await self.send_json({"full": "Room is full."})
                    return
            # 연결 성공 시 방 참여 인원에게 방 인원 정보 전송
            current_player = await self.update_current_player(
                len(RoomConsumer.rooms[self.room_id])
            )
            await self.send_user_info()
            # 방 인원이 정원일 경우 연결 해제 요청
            async with RoomConsumer.rooms_lock:
                if current_player == 2:
                    await self.create_game_result()
                    await self.delete_room()
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
        user_image_list = [str(user.image) for user in RoomConsumer.rooms[self.room_id]]
        user_win_list = [user.win for user in RoomConsumer.rooms[self.room_id]]
        user_lose_list = [user.lose for user in RoomConsumer.rooms[self.room_id]]
        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "broadcast_users",
                "username": username_list,
                "user_image": user_image_list,
                "user_win": user_win_list,
                "user_lose": user_lose_list,
            },
        )

    async def broadcast_users(self, event):
        # 모든 사용자에게 방에 있는 사용자 정보 전송
        username_list = event["username"]
        user_image_list = event["user_image"]
        user_win_list = event["user_win"]
        user_lose_list = event["user_lose"]
        user_data = {
            "type": "users",
            "user1": "",
            "user1_image": "",
            "user1_win": "",
            "user1_lose": "",
            "user2": "",
            "user2_image": "",
            "user2_win": "",
            "user2_lose": "",
        }
        for idx, username in enumerate(username_list, start=0):
            user_data[f"user{idx}"] = username
            user_data[f"user{idx}_image"] = user_image_list[idx]
            user_data[f"user{idx}_win"] = user_win_list[idx]
            user_data[f"user{idx}_lose"] = user_lose_list[idx]

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
                        await self.delete_room()
        # Leave room group
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.close()

    @database_sync_to_async
    def create_game_result(self):
        room_model = apps.get_model("rooms", "Room")
        game_model = apps.get_model("game", "GameResult")
        room = room_model.objects.get(id=self.room_id)
        game_model.objects.create(
            id=self.room_id,
            game_map=room.game_map,
            game_speed=room.game_speed,
            ball_color=room.ball_color,
            start_time=timezone.now(),
        )

    @database_sync_to_async
    def update_current_player(self, player):
        room_model = apps.get_model("rooms", "Room")
        room = room_model.objects.get(id=self.room_id)
        room.current_player = player
        room.save()
        return player

    @database_sync_to_async
    def delete_room(self):
        room_model = apps.get_model("rooms", "Room")
        try:
            room = room_model.objects.get(id=self.room_id)
            room.delete()
        except room_model.DoesNotExist:
            return
