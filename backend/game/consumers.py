import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import GameResult
from .modules import Ball, Player, Game


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):

    async def receive(self, text_data):

    async def disconnect(self):

