import json
import asyncio # 비동기 작업 라이브러리
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import GameResult


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):

    async def receive(self, text_data):

    async def disconnect(self):

    async def send_game_data(self, match, group):
        data = {


        }
        await self.channel_layer.group_send(
            group,
            {
                'type': 'game',
                'data': data,
            }
        )
