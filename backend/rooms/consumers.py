from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
import asyncio
from backend.middleware import JWTAuthMiddleware


class NormalRoomConsumer(AsyncJsonWebsocketConsumer):
    rooms = {}
    rooms_lock = asyncio.Lock()

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        await self.accept()

    async def receive_json(self, content):
        if content["type"] == "access":
            token = content["token"]
            try:
                self.user = await JWTAuthMiddleware.get_user(token)
            except:
                await self.send_json({"access": "User invalid or expired."})
                return
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
            else:
                await self.send_json({"access": "Access successful."})

            async with NormalRoomConsumer.rooms_lock:
                # 방이 다 차있을 경우 에러 (code=4003)
                if len(NormalRoomConsumer.rooms[self.room_id]) > 2:
                    await self.channel_layer.group_discard(
                        self.room_id, self.channel_name
                    )
                    NormalRoomConsumer.rooms[self.room_id].remove(self.user)
                    await self.send_json({"access": "Room is full."})
                    return
                if self.room_id not in NormalRoomConsumer.rooms:
                    NormalRoomConsumer.rooms[self.room_id] = []
                NormalRoomConsumer.rooms[self.room_id].append(self.user)

            # 연결 성공 시 방 참여 인원 모두에게 방 인원 정보 전송
            await self.send_user_info()
            # 방 인원이 정원일 경우 3초 뒤 소켓 연결 해제
            async with NormalRoomConsumer.rooms_lock:
                if len(NormalRoomConsumer.rooms[self.room_id]) == 2:
                    await self.channel_layer.group_send(
                        self.room_id,
                        {
                            "type": "send_disconnect",
                            "room_id": self.room_id,
                        },
                    )

    async def send_user_info(self):
        # 해당 방의 모든 유저 정보를 수집하여 전송
        username_list = [
            user.username for user in NormalRoomConsumer.rooms[self.room_id]
        ]
        userimage_list = [
            str(user.image) for user in NormalRoomConsumer.rooms[self.room_id]
        ]
        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "broadcast_users",
                "username": username_list,
                "userimage": userimage_list,
            },
        )

    async def broadcast_users(self, event):
        # 모든 유저에게 방에 있는 유저 정보 전송
        username_list = event["username"]
        userimage_list = event["userimage"]
        user_data = {
            "type": "users",
            "user1": "",
            "user1_image": "",
            "user2": "",
            "user2_image": "",
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
        async with NormalRoomConsumer.rooms_lock:
            if self.room_id in NormalRoomConsumer.rooms:
                if self.user in NormalRoomConsumer.rooms[self.room_id]:
                    NormalRoomConsumer.rooms[self.room_id].remove(self.user)
                    # 아무도 없으면 방 삭제
                    if not NormalRoomConsumer.rooms[self.room_id]:
                        del NormalRoomConsumer.rooms[self.room_id]
        # Leave room group
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.close()


class TournamentRoomConsumer(AsyncJsonWebsocketConsumer):
    rooms = {}
    matches = {}
    rooms_lock = asyncio.Lock()

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        await self.accept()

    async def receive_json(self, content):
        if content["type"] == "access":
            token = content["token"]
            try:
                self.user = await JWTAuthMiddleware.get_user(token)
            except:
                await self.send_json({"access": "User invalid or expired."})
                return
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
            else:
                await self.send_json({"access": "Access successful."})

            async with TournamentRoomConsumer.rooms_lock:
                # 방이 다 차있을 경우 에러 (code=4003)
                if len(TournamentRoomConsumer.rooms[self.room_id]) > 4:
                    await self.channel_layer.group_discard(
                        self.room_id, self.channel_name
                    )
                    TournamentRoomConsumer.rooms[self.room_id].remove(self.user)
                    await self.send_json({"access": "Room is full."})
                    return
                if self.room_id not in TournamentRoomConsumer.rooms:
                    TournamentRoomConsumer.rooms[self.room_id] = []
                TournamentRoomConsumer.rooms[self.room_id].append(self.user)

            # 대기실 참여 성공
            await self.send_user_info()
            async with TournamentRoomConsumer.rooms_lock:
                if len(TournamentRoomConsumer.rooms[self.room_id]) == 4:
                    await self.start_initial_matches()

        elif content["type"] == "match_result":
            winner = content["winner"]
            await self.handle_match_result(winner)

    async def send_user_info(self):
        # 해당 방의 모든 유저 정보를 수집하여 전송
        username_list = [
            user.username for user in TournamentRoomConsumer.rooms[self.room_id]
        ]
        userimage_list = [
            str(user.image) for user in TournamentRoomConsumer.rooms[self.room_id]
        ]
        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "broadcast_users",
                "username": username_list,
                "userimage": userimage_list,
            },
        )

    async def broadcast_users(self, event):
        # 모든 유저에게 방에 있는 유저 정보 전송
        username_list = event["username"]
        userimage_list = event["userimage"]
        user_data = {
            "type": "users",
            "user1": "",
            "user1_image": "",
            "user2": "",
            "user2_image": "",
            "user3": "",
            "user3_image": "",
            "user4": "",
            "user4_image": "",
        }
        for idx, username in enumerate(username_list, start=0):
            user_data[f"user{idx}"] = username
            user_data[f"user{idx}_image"] = userimage_list[idx]

        await self.send_json(user_data)

    async def start_initial_matches(self):
        players = TournamentRoomConsumer.rooms[self.room_id]
        self.rooms[self.room_id] = []

        match_1 = players[:2]
        match_2 = players[2:]
        self.matches[self.room_id] = [match_1, match_2]

        for player in match_1:
            await player.send_json(
                {
                    "type": "start_match",
                    "opponent": [p.user.username for p in match_1 if p != player],
                }
            )

        for player in match_2:
            await player.send_json(
                {
                    "type": "start_match",
                    "opponent": [p.user.username for p in match_2 if p != player],
                }
            )

    async def handle_match_result(self, winner, player):
        match = next((m for m in self.matches[self.room_id] if player in m), None)
        if match:
            self.matches[self.room_id].remove(match)

        self.rooms[self.room_id].append(winner)

        if len(self.matches[self.room_id]) == 0:
            if len(self.rooms[self.room_id]) == 2:
                await self.start_final_match()
            else:
                # Notify spectators
                spectators = [p for p in self.rooms[self.room_id] if p != winner]
                for spectator in spectators:
                    await spectator.send_json(
                        {"type": "match_ended", "winner": winner.user.username}
                    )

    async def start_final_match(self):
        final_match = list(self.rooms[self.room_id][:2])
        self.rooms[self.room_id] = []

        self.matches[self.room_id] = final_match

        for player in final_match:
            await player.send_json(
                {
                    "type": "start_final_match",
                    "opponent": [p.user.username for p in final_match if p != player],
                }
            )

    async def disconnect(self, close_code):
        async with TournamentRoomConsumer.rooms_lock:
            if self in self.rooms[self.room_id]:
                self.rooms[self.room_id].remove(self)
            for match in self.matches.get(self.room_id, []):
                if self in match:
                    match.remove(self)
                    if not match:
                        del self.matches[self.room_id]
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.close()
