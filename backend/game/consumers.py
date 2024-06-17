from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.apps import apps
from .modules import Player, Game
import asyncio
from backend.middleware import JWTAuthMiddleware


class NormalGameConsumer(AsyncJsonWebsocketConsumer):
    games: dict[str, Game] = {}
    games_lock = asyncio.Lock()

    async def connect(self) -> None:
        """
        url data 유효성 확인
        """
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        await self.accept()  # 소켓 연결 수락
        await self.channel_layer.group_add(
            self.game_id,  # 게임 DB id
            self.channel_name,  # Consumer 채널 이름
        )

    async def receive_json(self, content: dict) -> None:
        if content["type"] == "access":
            try:
                self.result = await self.get_game_result()
                if self.result.game_mode != "normal":
                    await self.send_json(
                        {"type": "error", "message": "Invalid game mode."}
                    )
            except Exception as e:
                await self.send_json({"type": "error", "message": str(e)})
            await self.user_access(content)
        # Game이 존재할 때만 명령처리
        else:
            match = NormalGameConsumer.games[self.game_id]
            player = match.get_players()[self.color]
            async with NormalGameConsumer.games_lock:
                if content["type"] == "ready":
                    if match.set_ready(player):
                        self.loop = asyncio.create_task(self.game_loop(player))
            if content["type"] == "move":
                player.set_pos(content["y"], content["z"])

    async def game_loop(self, player: "Player") -> None:
        while True:
            match = NormalGameConsumer.games[self.game_id]
            if not match:
                await self.send_json({"type": "error", "message": "Game not found"})
                return
            await asyncio.sleep(0.03)
            match.game_render(player)
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "broadcast_users",
                    "data": match.game_data(),
                    "data_type": "render",
                },
            )
            if match.winner:
                await self.save_game_result(match)
                await self.channel_layer.group_send(
                    self.game_id,
                    {
                        "type": "broadcast_users",
                        "data": match.result_data(),
                        "data_type": "result",
                    },
                )
                del NormalGameConsumer.games[self.game_id]
                break

    async def broadcast_users(self, event: dict) -> None:
        data = event["data"]
        data["type"] = event["data_type"]
        await self.send_json(data)

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_send(
            self.game_id,
            {
                "type": "close_group",
            },
        )

    async def close_group(self, event: dict) -> None:
        await self.send_json({"type": "exit"})
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    async def user_access(self, content: dict) -> None:
        token = content["token"]
        try:
            self.user = await JWTAuthMiddleware.get_user(token)
        except:
            await self.send_json({"access": "User invalid or expired."})
            return
        if not self.user.is_authenticated:
            await self.send_json({"access": "User not authenticated."})
            return
        else:
            await self.send_json({"access": "Access successful."})

        # Game 객체 생성
        if self.game_id not in NormalGameConsumer.games:
            NormalGameConsumer.games[self.game_id] = Game(self.result.game_speed)
        match = NormalGameConsumer.games[self.game_id]

        # 유저 중복 검사 (user.username, player nickname 비교 -> channel layer discard (mutex))

        # 들어온 순서대로 red, blue 배정
        if match.p1 is None:
            match.p1 = Player(type="red", nick=self.user.username)
            self.color = "red"
        elif match.p2 is None:
            match.p2 = Player(type="blue", nick=self.user.username)
            self.color = "blue"
        else:
            await self.send_json({"type": "error", "message": "Game is full."})
            return
        # start data 전송
        await self.send_json(match.start_data(color=self.color, game=self.result))

    @database_sync_to_async
    def get_game_result(self):
        GameResult = apps.get_model("game", "GameResult")
        return GameResult.objects.get(id=self.game_id)

    @database_sync_to_async
    def save_game_result(self, match: Game) -> None:
        GameResult = apps.get_model("game", "GameResult")
        result = GameResult.objects.get(id=self.game_id)
        User = apps.get_model("users", "User")
        result.winner = User.objects.get(username=match.winner)
        result.player1 = User.objects.get(username=match.p1.nick)
        result.player2 = User.objects.get(username=match.p2.nick)
        result.player1_score = match.p1.score
        result.player2_score = match.p2.score
        result.save()


# class TournamentGameConsumer(NormalGameConsumer):
#     games: dict[str, Game] = {}
#     games_lock = asyncio.Lock()
#
#     async def receive_json(self, content) -> None:
#         if content["type"] == "access":
#             try:
#                 self.result = await self.get_game_result()
#             except Exception as e:
#                 await self.send_json({"error": str(e)})
#             await self.user_access(content)
#         # Game이 존재할 때만 명령처리
#         else:
#             match = NormalGameConsumer.games[self.game_id]
#             player = match.get_players()[self.color]
#             async with NormalGameConsumer.games_lock:
#                 if content["type"] == "ready":
#                     if match.set_ready(player):
#                         self.loop = asyncio.create_task(self.game_loop(player))
#             if content["type"] == "move":
#                 player.set_pos(content["y"], content["z"])
#
#     async def game_loop(self, player) -> None:
#         while True:
#             match = NormalGameConsumer.games[self.game_id]
#             if not match:
#                 await self.send_json({"error": "Game not found"})
#                 return
#             await asyncio.sleep(0.03)
#             match.game_render(player)
#             await self.channel_layer.group_send(
#                 self.game_id,
#                 {
#                     "type": "broadcast_users",
#                     "data": match.game_data(),
#                     "data_type": "render",
#                 },
#             )
#             if match.winner:
#                 await self.save_game_result(match)
#                 await self.channel_layer.group_send(
#                     self.game_id,
#                     {
#                         "type": "broadcast_users",
#                         "data": match.result_data(),
#                         "data_type": "result",
#                     },
#                 )
#                 del NormalGameConsumer.games[self.game_id]
#                 break
