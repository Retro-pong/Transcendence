from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.apps import apps
from .modules import Player, Game, READY, END, DISCONNECTED
from backend.middleware import JWTAuthMiddleware
import asyncio


class NormalGameConsumer(AsyncJsonWebsocketConsumer):
    games: dict[str, Game] = {}
    games_lock = asyncio.Lock()

    async def connect(self) -> None:
        """
        연결 수락 및 game id 저장
        """
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.color = ""
        await self.accept()

    async def receive_json(self, content: dict) -> None:
        """
        소켓 request 처리
        """
        if content["type"] == "access":
            # game_id 유효성 체크
            valid = await self.check_game_id_valid("normal")
            if not valid:
                return
            await self.user_access(content)
        elif content["type"] == "ready":
            match = NormalGameConsumer.games[self.game_id]
            await self.change_status(self.color, READY)
            async with NormalGameConsumer.games_lock:
                check_ready = match.set_ready(match.get_players()[self.color])
                if check_ready:
                    self.channel_layer.background_task = asyncio.create_task(
                        self.game_loop()
                    )
                if not check_ready:
                    self.task = asyncio.create_task(self.check_opponent_connect(match))
        elif content["type"] == "move":
            try:
                NormalGameConsumer.games[self.game_id].get_players()[
                    self.color
                ].set_pos(content["y"], content["z"])
            except:
                return

    async def disconnect(self, code: int) -> None:
        # match의 winner가 없을 경우(비정상 종료 시) db 삭제
        await self.delete_game_result(self.game_id)
        # 비정상 종료 시 player status disconnect로 변경
        await self.change_status(self.color, DISCONNECTED)
        await self.channel_layer.group_discard(self.game_id, self.channel_name)

    async def game_loop(self) -> None:
        await asyncio.sleep(3)
        while True:
            await asyncio.sleep(0.03)
            try:
                match = NormalGameConsumer.games[self.game_id]
            except:
                # game 객체가 존재하지 않을 경우
                await self.send_json({"type": "error", "message": "Game not found"})
                break
            # disconnect 발생 시 winner 없이 게임 결과 전송
            if match.p1.status == DISCONNECTED or match.p2.status == DISCONNECTED:
                match.winner = "None"
            if match.winner:
                if match.winner != "None":
                    await self.save_game_result(match)
                await self.channel_layer.group_send(
                    self.game_id,
                    {
                        "type": "broadcast_users",
                        "data": match.result_data("normal"),
                        "data_type": "result",
                    },
                )
                del NormalGameConsumer.games[self.game_id]
                break
            # 게임 데이터 전송
            match.game_render()
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "broadcast_users",
                    "data": match.game_data(),
                    "data_type": "render",
                },
            )

    async def user_access(self, content: dict) -> None:
        token = content["token"]
        try:
            self.user = await JWTAuthMiddleware.get_user(token)
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
                return
        except Exception as e:
            await self.send_json({"access": str(e)})
            return
        # 토큰 유효 시
        await self.send_json({"access": "Access successful."})
        # 채널 추가
        await self.channel_layer.group_add(
            self.game_id,
            self.channel_name,
        )
        # Game 객체 생성
        if self.game_id not in NormalGameConsumer.games:
            NormalGameConsumer.games[self.game_id] = Game(self.result.game_speed)
        match = NormalGameConsumer.games[self.game_id]

        # 유저 중복 검사
        async with NormalGameConsumer.games_lock:
            if (match.p1 and match.p1.nick == self.user.username) or (
                match.p2 and match.p2.nick == self.user.username
            ):
                await self.send_json(
                    {"type": "error", "message": "User already in game."}
                )
                return
        # 들어온 순서대로 red, blue 배정
        if match.p1 is None:
            match.p1 = Player(type="red", nick=self.user.username, id=self.user.id)
            self.color = "red"
        elif match.p2 is None:
            match.p2 = Player(type="blue", nick=self.user.username, id=self.user.id)
            self.color = "blue"
        else:
            await self.send_json({"type": "error", "message": "Game is full."})
            return
        # start data 전송
        await self.send_json(match.start_data(color=self.color, game=self.result))

    async def check_opponent_connect(self, match):
        await asyncio.sleep(10)
        if match.p1 and match.p1.status != DISCONNECTED:
            if match.p2 and match.p2.status != DISCONNECTED:
                return
        await self.send_json({"type": "error", "message": "Opponent not connected"})

    async def broadcast_users(self, event: dict) -> None:
        data = event["data"]
        data["type"] = event["data_type"]
        await self.send_json(data)

    async def check_game_id_valid(self, type: str) -> bool:
        try:
            # game_id 에 해당하는 game result db 가져오기
            self.result = await self.get_game_result()
            # game mode 확인
            if self.result.game_mode != type:
                await self.send_json({"type": "error", "message": "Invalid game mode."})
                return False
            return True
        except:
            await self.send_json({"type": "error", "message": "Invalid game"})
            return False

    async def change_status(self, color, status: int) -> None:
        # game 객체가 남아있을 경우 비정상 종료
        if self.game_id in NormalGameConsumer.games:
            if color:
                match = NormalGameConsumer.games[self.game_id]
                match.get_players()[color].set_status(status)

    @database_sync_to_async
    def get_game_result(self):
        GameResult = apps.get_model("game", "GameResult")
        return GameResult.objects.get(id=self.game_id)

    @database_sync_to_async
    def delete_game_result(self, game_id) -> None:
        GameResult = apps.get_model("game", "GameResult")
        try:
            result = GameResult.objects.get(id=game_id)
            if not result.winner:
                result.delete()
        except:
            return

    @database_sync_to_async
    def save_game_result(self, match: Game) -> None:
        GameResult = apps.get_model("game", "GameResult")
        result = GameResult.objects.get(id=self.game_id)
        User = apps.get_model("users", "User")
        result.winner = User.objects.get(id=match.winner_id)
        result.player1 = User.objects.get(id=match.p1.id)
        result.player2 = User.objects.get(id=match.p2.id)
        if match.p1.score > match.p2.score:
            result.player1.win += 1
            result.player2.lose += 1
        else:
            result.player1.lose += 1
            result.player2.win += 1
        result.player1.save()
        result.player2.save()
        result.player1_score = match.p1.score
        result.player2_score = match.p2.score
        result.save()


class SemiFinalGameConsumer(NormalGameConsumer):
    games: dict[str, Game] = {}
    games_lock = asyncio.Lock()

    async def connect(self) -> None:
        """
        연결 수락 및 game, opponent, final id 저장
        """
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.opponent_id = self.scope["url_route"]["kwargs"]["opponent_id"]
        self.final_id = self.scope["url_route"]["kwargs"]["final_id"]
        self.color = ""
        await self.accept()  # 소켓 연결 수락

    async def receive_json(self, content: dict) -> None:
        """
        소켓 request 처리
        """
        if content["type"] == "access":
            # game_id 유효성 체크
            valid = await self.check_game_id_valid("tournament")
            if not valid:
                return
            await self.user_access(content)
        elif content["type"] == "ready":
            match = SemiFinalGameConsumer.games[self.game_id]
            await self.change_status(self.color, READY)
            async with SemiFinalGameConsumer.games_lock:
                check_ready = match.set_ready(match.get_players()[self.color])
                if check_ready:
                    self.channel_layer.background_task = asyncio.create_task(
                        self.game_loop()
                    )

        elif content["type"] == "move":
            try:
                SemiFinalGameConsumer.games[self.game_id].get_players()[
                    self.color
                ].set_pos(content["y"], content["z"])
            except:
                return

    async def disconnect(self, code: int) -> None:
        # match의 winner가 없을 경우(비정상 종료 시) db 삭제
        await self.delete_game_result(self.game_id)
        # 비정상 종료 시 player status disconnect로 변경
        await self.change_status(self.color, DISCONNECTED)
        await self.channel_layer.group_discard(self.game_id, self.channel_name)
        await self.channel_layer.group_discard(self.final_id, self.channel_name)

    async def game_loop(self) -> None:
        await asyncio.sleep(3)
        while True:
            await asyncio.sleep(0.03)
            try:
                match = SemiFinalGameConsumer.games[self.game_id]
            except:
                # game 객체가 존재하지 않을 경우
                await self.send_json({"type": "error", "message": "Game not found"})
                break
            # disconnect 발생 시 winner 없이 게임 결과 전송
            if match.p1.status == DISCONNECTED or match.p2.status == DISCONNECTED:
                match.winner = "None"
            if match.winner:
                if match.winner != "None":
                    await self.save_game_result(match)
                await self.channel_layer.group_send(
                    self.game_id,
                    {
                        "type": "broadcast_users",
                        "data": match.result_data("tournament"),
                        "data_type": "result",
                    },
                )
                # disconnect가 아닐 경우 정상 종료로 변경
                async with SemiFinalGameConsumer.games_lock:
                    if match.get_players()["red"].status != DISCONNECTED:
                        await self.change_status("red", END)
                    if match.get_players()["blue"].status != DISCONNECTED:
                        await self.change_status("blue", END)
                break
            # 게임 데이터 전송
            match.game_render()
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "broadcast_users",
                    "data": match.game_data(),
                    "data_type": "render",
                },
            )
        # 양쪽 경기 종료 시 실행
        async with SemiFinalGameConsumer.games_lock:
            await self.set_final(match)

    async def set_final(self, match: Game):
        if match.check_game_end():
            opponent_match = SemiFinalGameConsumer.games[self.opponent_id]
            if opponent_match.check_game_end():
                winner1 = match.get_winner()
                winner2 = opponent_match.get_winner()
                is_final = True
                if winner1 == "None" or winner2 == "None":
                    is_final = False
                await self.channel_layer.group_send(
                    self.final_id,
                    {
                        "type": "broadcast_final",
                        "data": match.tournament_result_data(
                            is_final,
                            self.final_id,
                            winner1,
                            winner2,
                        ),
                        "data_type": "final",
                    },
                )
                del SemiFinalGameConsumer.games[self.game_id]
                del SemiFinalGameConsumer.games[self.opponent_id]
                if not is_final:
                    await self.delete_game_result(self.final_id)

    async def broadcast_final(self, event: dict) -> None:
        data = event["data"]
        data["type"] = event["data_type"]
        if (
            self.user.username != data["winner1"]
            and self.user.username != data["winner2"]
        ):
            data["isFinalUser"] = False
        else:
            data["isFinalUser"] = True
        await self.send_json(data)

    async def user_access(self, content: dict) -> None:
        token = content["token"]
        try:
            self.user = await JWTAuthMiddleware.get_user(token)
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
                return
        except Exception as e:
            await self.send_json({"access": str(e)})
            return
        # 토큰 유효 시
        await self.send_json({"access": "Access successful."})
        # 채널 추가
        await self.channel_layer.group_add(
            self.game_id,
            self.channel_name,
        )
        await self.channel_layer.group_add(
            self.final_id,
            self.channel_name,
        )
        # Game 객체 생성
        if self.game_id not in SemiFinalGameConsumer.games:
            SemiFinalGameConsumer.games[self.game_id] = Game(self.result.game_speed)
        match = SemiFinalGameConsumer.games[self.game_id]

        # 유저 중복 검사
        async with SemiFinalGameConsumer.games_lock:
            if (match.p1 and match.p1.nick == self.user.username) or (
                match.p2 and match.p2.nick == self.user.username
            ):
                await self.send_json(
                    {"type": "error", "message": "User already in game."}
                )
                return
        # 들어온 순서대로 red, blue 배정
        if match.p1 is None:
            match.p1 = Player(type="red", nick=self.user.username, id=self.user.id)
            self.color = "red"
        elif match.p2 is None:
            match.p2 = Player(type="blue", nick=self.user.username, id=self.user.id)
            self.color = "blue"
        else:
            await self.send_json({"type": "error", "message": "Game is full."})
            return
        # start data 전송
        await self.send_json(match.start_data(color=self.color, game=self.result))

    async def change_status(self, color, status: int) -> None:
        # game 객체가 남아있을 경우 비정상 종료
        if self.game_id in SemiFinalGameConsumer.games:
            if color:
                match = SemiFinalGameConsumer.games[self.game_id]
                match.get_players()[color].set_status(status)


class FinalGameConsumer(NormalGameConsumer):
    games: dict[str, Game] = {}
    games_lock = asyncio.Lock()

    async def receive_json(self, content: dict) -> None:
        """
        소켓 request 처리
        """
        if content["type"] == "access":
            # game_id 유효성 체크
            valid = await self.check_game_id_valid("tournament")
            if not valid:
                return
            await self.user_access(content)
        elif content["type"] == "ready":
            match = FinalGameConsumer.games[self.game_id]
            await self.change_status(self.color, READY)
            async with FinalGameConsumer.games_lock:
                check_ready = match.set_ready(match.get_players()[self.color])
                if check_ready:
                    self.channel_layer.background_task = asyncio.create_task(
                        self.game_loop()
                    )
                if not check_ready:
                    self.task = asyncio.create_task(self.check_opponent_connect(match))
        elif content["type"] == "move":
            try:
                FinalGameConsumer.games[self.game_id].get_players()[self.color].set_pos(
                    content["y"], content["z"]
                )
            except:
                return

    async def game_loop(self) -> None:
        await asyncio.sleep(3)
        while True:
            await asyncio.sleep(0.03)
            try:
                match = FinalGameConsumer.games[self.game_id]
            except:
                # game 객체가 존재하지 않을 경우
                await self.send_json({"type": "error", "message": "Game not found"})
                break
            # disconnect 발생 시 winner 없이 게임 결과 전송
            if match.p1.status == DISCONNECTED or match.p2.status == DISCONNECTED:
                match.winner = "None"
            if match.winner:
                if match.winner != "None":
                    await self.save_game_result(match)
                await self.channel_layer.group_send(
                    self.game_id,
                    {
                        "type": "broadcast_users",
                        "data": match.result_data("tournament"),
                        "data_type": "result",
                    },
                )
                del FinalGameConsumer.games[self.game_id]
                break
            # 게임 데이터 전송
            match.game_render()
            await self.channel_layer.group_send(
                self.game_id,
                {
                    "type": "broadcast_users",
                    "data": match.game_data(),
                    "data_type": "render",
                },
            )

    async def user_access(self, content: dict) -> None:
        token = content["token"]
        try:
            self.user = await JWTAuthMiddleware.get_user(token)
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
                return
        except Exception as e:
            await self.send_json({"access": str(e)})
            return
        # 토큰 유효 시
        await self.send_json({"access": "Access successful."})
        # 채널 추가
        await self.channel_layer.group_add(
            self.game_id,
            self.channel_name,
        )
        # Game 객체 생성
        if self.game_id not in FinalGameConsumer.games:
            FinalGameConsumer.games[self.game_id] = Game(self.result.game_speed)
        match = FinalGameConsumer.games[self.game_id]

        # 유저 중복 검사
        async with FinalGameConsumer.games_lock:
            if (match.p1 and match.p1.nick == self.user.username) or (
                match.p2 and match.p2.nick == self.user.username
            ):
                await self.send_json(
                    {"type": "error", "message": "User already in game."}
                )
                return
        # 들어온 순서대로 red, blue 배정
        if match.p1 is None:
            match.p1 = Player(type="red", nick=self.user.username, id=self.user.id)
            self.color = "red"
        elif match.p2 is None:
            match.p2 = Player(type="blue", nick=self.user.username, id=self.user.id)
            self.color = "blue"
        else:
            await self.send_json({"type": "error", "message": "Game is full."})
            return
        # start data 전송
        await self.send_json(match.start_data(color=self.color, game=self.result))

    async def change_status(self, color, status: int) -> None:
        # game 객체가 남아있을 경우 비정상 종료
        if self.game_id in FinalGameConsumer.games:
            if color:
                match = FinalGameConsumer.games[self.game_id]
                match.get_players()[color].set_status(status)
