from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Room
from game.models import GameResult
from channels.db import database_sync_to_async


class RoomConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        # Join room group
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
