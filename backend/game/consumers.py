from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async #동기식 데이터베이스 작업을 비동기식 코드에서 호출
from channels import channel_layer
from .models import GameResult
from .modules import Ball, Player, Game
import asyncio

# ----------------------
# GameConsumer class value
# user
# game_id
# result
# color
# loop
# ----------------------

#전체 활성화 게임 객체
games: dict[str, Game] = {}

class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        #url data 유효성 확인
        await self.check_connect_data()
        #소켓 연결 수락
        await self.accept()
        #info setting
        await self.set_game_info()

    @database_sync_to_async
    async def check_connect_data(self):
        self.user = self.scope['user']
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        try:
        #해당하는 game_id가 없을 경우 연결 해제
            self.result = GameResult.objects.get(game_id=self.game_id)
        except GameResult.DoesNotExist:
            await self.close()

    async def set_game_info(self):
        # 그룹에 추가
        await self.channel_layer.group_add(
            self.game_id,
            self.channel_name,
        )
        # Game 객체 생성
        if self.game_id not in games:
            games[self.game_id] = Game()
        match = games[self.game_id]
        # 들어온 순서대로 red, blue 배정
        if match.p1 is None:
            match.p1 = Player(type="red", nick=self.user.username)
            self.color = "red"
        elif match.p2 is None:
            match.p2 = Player(type="blue", nick=self.user.username)
            self.color = "blue"
        else:
            self.close()
            return
        #start data 전송
        self.send_json(match.start_data(color=self.color, game=self.result))


    @database_sync_to_async
    async def receive_json(self, content):
        match = games[self.game_id]
        if content['type'] == 'ready':
            if match.set_ready(self.color):
                self.loop = asyncio.create_task(self.game_loop(match))
        #elif content['type'] == 'move':

    async def game_loop(self, match):
        while match.winner is None:
            await asyncio.sleep(0.03)
            self.channel_layer.group_send(self.game_id, match.game_data())



    async def disconnect(self):
        await self.channel_layer.group_discard()
        await self.channel_layer.group_send(self.channel_name, {'type': 'close_group',})

    async def close_group(self, event):
        await self.close()


#class GameTournamentConsumer(AsyncJsonWebsocketConsumer):




