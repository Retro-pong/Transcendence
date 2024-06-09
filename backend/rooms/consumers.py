from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
import asyncio


class RoomConsumer(AsyncJsonWebsocketConsumer):
    rooms = {}
    rooms_lock = asyncio.Lock()

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.channel_layer = get_channel_layer()
        # Join room group
        await self.channel_layer.group_add(self.room_id, self.channel_name)

        async with RoomConsumer.rooms_lock:
            if self.room_id not in RoomConsumer.rooms:
                RoomConsumer.rooms[self.room_id] = []
            RoomConsumer.rooms[self.room_id].append(self.channel_name)
            if len(RoomConsumer.rooms[self.room_id]) >= 3:
                await self.channel_layer.group_discard(self.room_id, self.channel_name)
                RoomConsumer.rooms[self.room_id].remove(self.channel_name)
                await self.close(code=4003)  # 임시 오류 코드
                return
        await self.accept()

    async def disconnect(self, close_code):
        async with RoomConsumer.rooms_lock:
            if self.room_id in RoomConsumer.rooms:
                if self.channel_name in RoomConsumer.rooms[self.room_id]:
                    RoomConsumer.rooms[self.room_id].remove(self.channel_name)
                    # 방에 더 이상 참여자가 없으면 방을 삭제
                    if not RoomConsumer.rooms[self.room_id]:
                        del RoomConsumer.rooms[self.room_id]
        # Leave room group
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
