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
            except Exception as e:
                await self.send_json({"access": "User invalid or expired."})
                return
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
            else:
                await self.send_json({"access": "Access successful."})
            # 방이 다 차있을 경우 에러 (code=4003)
            async with NormalRoomConsumer.rooms_lock:
                if self.room_id not in NormalRoomConsumer.rooms:
                    NormalRoomConsumer.rooms[self.room_id] = []
                NormalRoomConsumer.rooms[self.room_id].append(self.user)
                if len(NormalRoomConsumer.rooms[self.room_id]) >= 3:
                    await self.channel_layer.group_discard(
                        self.room_id, self.channel_name
                    )
                    NormalRoomConsumer.rooms[self.room_id].remove(self.user)
                    await self.send_json({"access": "Room is full."})
                    return
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
        # 해당 방의 모든 사용자 정보를 수집하여 전송
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
        # 모든 사용자에게 방에 있는 사용자 정보 전송
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
                    # 방에 더 이상 참여자가 없으면 방을 삭제
                    if not NormalRoomConsumer.rooms[self.room_id]:
                        del NormalRoomConsumer.rooms[self.room_id]
        # Leave room group
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.close()


class TournamentRoomConsumer(AsyncJsonWebsocketConsumer):
    rooms = []
    matches = []

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
            except Exception as e:
                await self.send_json({"access": "User invalid or expired."})
                return
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
            else:
                await self.send_json({"access": "Access successful."})

            # Add the player to the waiting room
            self.rooms.append(self)
            if len(self.rooms) >= 4:
                await self.start_initial_matches()

        elif content["type"] == "match_result":
            winner = content["winner"]
            await self.handle_match_result(winner)

    async def start_initial_matches(self):
        players = self.rooms[:4]
        self.rooms = self.rooms[4:]

        match_1 = players[:2]
        match_2 = players[2:]

        self.matches.extend([match_1, match_2])

        for player in match_1:
            await player.send_json({"type": "start_match", "opponent": match_1})

        for player in match_2:
            await player.send_json({"type": "start_match", "opponent": match_2})

        # Allow other players to watch the matches
        for watcher in self.rooms:
            await watcher.send_json(
                {"type": "watch_match", "match_1": match_1, "match_2": match_2}
            )

    async def handle_match_result(self, winner):
        # Find the match and remove it from the matches
        match = next((m for m in self.matches if winner in m), None)
        if match:
            self.matches.remove(match)

        # Add the winner to the waiting room for the final match
        self.rooms.append(winner)

        # If both initial matches are finished, start the final match
        if len(self.matches) == 0 and len(self.rooms) == 2:
            await self.start_final_match()

    async def start_final_match(self):
        final_match = self.rooms[:2]
        self.rooms = self.rooms[2:]

        for player in final_match:
            await player.send_json(
                {"type": "start_final_match", "opponent": final_match}
            )

        # Allow other players to watch the final match
        for watcher in self.rooms:
            await watcher.send_json(
                {"type": "watch_final_match", "final_match": final_match}
            )

    async def disconnect(self, close_code):
        # Remove the player from the waiting room
        if self in self.rooms:
            self.rooms.remove(self)
        # Remove the player from any ongoing matches
        for match in self.matches:
            if self in match:
                match.remove(self)
                break
        # Leave room group
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.close()
