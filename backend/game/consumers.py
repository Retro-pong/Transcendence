from channels.generic.websocket import AsyncJsonWebsocketConsumer

# 동기식 데이터베이스 작업을 비동기식 코드에서 호출
from channels.db import database_sync_to_async
from django.apps import apps
from .modules import Ball, Player, Game
import asyncio

# 전체 활성화 게임 객체
games: dict[str, Game] = {}


class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        await self.check_connect_data()
        await self.accept()  # 소켓 연결 수락
        await self.set_game_info()

    async def check_connect_data(self) -> None:
        """
        url data 유효성 확인
        """
        self.user = self.scope["user"]
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        try:
            GameResult = apps.get_model("game", "GameResult")
            self.result = GameResult.objects.get(game_id=self.game_id)
        except GameResult.DoesNotExist:
            await self.close()  # 해당하는 game_id가 없을 경우 연결 해제

    async def set_game_info(self) -> None:
        """
        게임 정보 설정
        """
        # 그룹에 추가
        await self.channel_layer.group_add(
            self.game_id,  # 게임 DB id
            self.channel_name,  # Consumer 채널 이름
        )
        # Game 객체 생성
        if self.game_id not in games:
            games[self.game_id] = Game()
        match = games[self.game_id]
        # TODO: 허가되지 않은 유저 처리 (채널 고유 키 발급해서 확인하는 등)
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
        # start data 전송
        self.send_json(match.start_data(color=self.color, game=self.result))

    async def receive_json(self, content) -> None:
        match = games[self.game_id]
        player = match.players[self.color]
        if content["type"] == "ready":
            if match.set_ready(player):
                self.loop = asyncio.create_task(self.game_loop(match, player))
        elif content["type"] == "move":
            player.set_pos(content["y"], content["z"])

    #
    async def game_loop(self, match, player) -> None:
        while True:
            await asyncio.sleep(0.03)
            match.game_render(player)
            await self.channel_layer.group_send(self.game_id, match.game_data())
            if match.winner:
                await self.channel_layer.group_send(
                    self.game_id, match.result_data(self.game_id)
                )
                await self.channel_layer.group_send(
                    self.channel_name,
                    {
                        "type": "close_group",
                    },
                )
                break

    # TODO: 소켓 끊기면 게임 터트릴 건지 논의 필요
    async def disconnect(self) -> None:
        await self.channel_layer.group_discard()
        await self.channel_layer.group_send(
            self.channel_name,
            {
                "type": "close_group",
            },
        )
        del games[self.game_id]

    async def close_group(self, event) -> None:
        await self.channel_layer.group_discard()
        await self.close()


# class GameTournamentConsumer(AsyncJsonWebsocketConsumer):
