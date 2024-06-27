from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Room
from users.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase
from .routing import websocket_urlpatterns
from channels.routing import URLRouter
from channels.db import database_sync_to_async


class JoinRoomAPIViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )

        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()

        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.cookies["refresh_token"] = refresh_token
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

        # Create test rooms
        Room.objects.create(
            room_name="Room1",
            game_mode="normal",
            game_speed=1,
            game_map="map1",
            ball_color="0xffffff",
        )
        Room.objects.create(
            room_name="Room2",
            game_mode="tournament",
            game_speed=5,
            game_map="map2",
            ball_color="0x000000",
        )

    def test_get_normal_rooms(self):
        url = reverse("room:join_normal")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        room_names = [room["room_name"] for room in response.data]
        self.assertIn("Room1", room_names)

    def test_get_tournament_room(self):
        url = reverse("room:join_tournament")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        room_names = [room["room_name"] for room in response.data]
        self.assertIn("Room2", room_names)


class CreateRoomAPIViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )

        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()

        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.cookies["refresh_token"] = refresh_token
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

    def test_create_room(self):
        url = reverse("room:create_room")
        data = {
            "room_name": "NewRoom",
            "game_mode": "normal",
            "game_speed": 3,
            "game_map": "map2",
            "game_ball": "0xffffff",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Room.objects.filter(room_name="NewRoom").exists())

    def test_create_room_missing_field(self):
        url = reverse("room:create_room")
        data = {
            "room_name": "IncompleteRoom",
            # Missing fields like game_mode, game_speed, game_map, max_players
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Room.objects.filter(room_name="IncompleteRoom").exists())


class NormalRoomConsumerTest(TransactionTestCase):
    @database_sync_to_async
    def create_test_user(self, username, email, password):
        return User.objects.create_user(username, email, password)

    @database_sync_to_async
    def create_room(self, room_name, game_mode, game_map, game_speed, game_ball):
        return Room.create_room(room_name, game_mode, game_map, game_speed, game_ball)

    async def test_room_connect(self):
        room = await self.create_room("123", "normal", "map1", 2, "#000000")
        user = await self.create_test_user(
            username="testuser", email="test@test.com", password="1234"
        )
        token = TokenObtainPairSerializer.get_token(user)
        access_token = str(token.access_token)
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_room/{room.id}/",
        )
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)
        await communicator.send_json_to({"type": "access", "token": access_token})
        response = await communicator.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator.receive_json_from()
        assert response["type"] == "users"
        # Clean up
        await communicator.disconnect()

    async def test_room_connect_full(self):
        room = await self.create_room("1234", "normal", "map1", 2, "#000000")
        user1 = await self.create_test_user(
            username="testuser1", email="test1@example.com", password="1234"
        )
        user2 = await self.create_test_user(
            username="testuser2", email="test2@example.com", password="1234"
        )
        user3 = await self.create_test_user(
            username="testuser3", email="test3@example.com", password="1234"
        )
        token1 = TokenObtainPairSerializer.get_token(user1)
        token2 = TokenObtainPairSerializer.get_token(user2)
        token3 = TokenObtainPairSerializer.get_token(user3)
        access_token1 = str(token1.access_token)
        access_token2 = str(token2.access_token)
        access_token3 = str(token3.access_token)

        # Connect the first client
        communicator1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_room/{room.id}/",
        )
        connected1, subprotocol1 = await communicator1.connect()
        self.assertTrue(connected1)
        await communicator1.send_json_to({"type": "access", "token": access_token1})
        response = await communicator1.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})

        # Connect the second client
        communicator2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_room/{room.id}/",
        )
        connected2, subprotocol2 = await communicator2.connect()
        self.assertTrue(connected2)
        await communicator2.send_json_to({"type": "access", "token": access_token2})
        response = await communicator2.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})

        # Try to connect the third client, which should fail
        communicator3 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_room/{room.id}/",
        )
        connected3, subprotocol3 = await communicator3.connect()
        self.assertTrue(connected3)
        await communicator3.send_json_to({"type": "access", "token": access_token3})
        response = await communicator3.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator3.receive_json_from()
        self.assertEqual(response, {"type": "error", "message": "Room is full."})

        # Clean up
        await communicator1.disconnect()
        await communicator2.disconnect()
        await communicator3.disconnect()

    async def test_user_duplicate(self):
        room = await self.create_room("123456", "normal", "map1", 2, "#000000")
        user = await self.create_test_user(
            username="testuser123", email="test123@test.com", password="1234"
        )
        token = TokenObtainPairSerializer.get_token(user)
        access_token = str(token.access_token)
        communicator1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_room/{room.id}/",
        )
        connected, subprotocol = await communicator1.connect()
        self.assertTrue(connected)
        await communicator1.send_json_to({"type": "access", "token": access_token})
        response = await communicator1.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator1.receive_json_from()
        assert response["type"] == "users"
        communicator2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_room/{room.id}/",
        )
        connected, subprotocol = await communicator2.connect()
        self.assertTrue(connected)
        await communicator2.send_json_to({"type": "access", "token": access_token})
        response = await communicator2.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator2.receive_json_from()
        assert response["type"] == "error"
        assert response["message"] == "User already in room."
        # Clean up
        await communicator1.disconnect()
        await communicator2.disconnect()


class TournamentRoomConsumerTest(TransactionTestCase):
    @database_sync_to_async
    def create_test_user(self, username, email, password):
        return User.objects.create_user(username, email, password)

    @database_sync_to_async
    def create_room(self, room_name, game_mode, game_map, game_speed, game_ball):
        return Room.create_room(room_name, game_mode, game_map, game_speed, game_ball)

    async def test_tournament_room(self):
        room = await self.create_room("1234567890", "tournament", "map1", 2, "#000000")
        user1 = await self.create_test_user(
            username="testuser1", email="test1@test.com", password="1234"
        )
        token = TokenObtainPairSerializer.get_token(user1)
        access_token = str(token.access_token)
        communicator1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator1.connect()
        self.assertTrue(connected)
        await communicator1.send_json_to({"type": "access", "token": access_token})
        response = await communicator1.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator1.receive_json_from()
        self.assertEqual(response["type"], "users")

        user2 = await self.create_test_user(
            username="testuser2", email="test2@test.com", password="1234"
        )
        token = TokenObtainPairSerializer.get_token(user2)
        access_token = str(token.access_token)
        communicator2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator2.connect()
        self.assertTrue(connected)
        await communicator2.send_json_to({"type": "access", "token": access_token})
        response = await communicator2.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator1.receive_json_from()
        self.assertEqual(response["type"], "users")
        response = await communicator2.receive_json_from()
        self.assertEqual(response["type"], "users")

        user3 = await self.create_test_user(
            username="testuser3", email="test3@test.com", password="<PASSWORD>"
        )
        token = TokenObtainPairSerializer.get_token(user3)
        access_token = str(token.access_token)
        communicator3 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator3.connect()
        self.assertTrue(connected)
        await communicator3.send_json_to({"type": "access", "token": access_token})
        response = await communicator3.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator1.receive_json_from()
        self.assertEqual(response["type"], "users")
        response = await communicator2.receive_json_from()
        self.assertEqual(response["type"], "users")
        response = await communicator3.receive_json_from()
        self.assertEqual(response["type"], "users")

        user4 = await self.create_test_user(
            username="testuser4", email="test4@test.com", password="<PASSWORD>"
        )
        token = TokenObtainPairSerializer.get_token(user4)
        access_token = str(token.access_token)
        communicator4 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator4.connect()
        self.assertTrue(connected)
        await communicator4.send_json_to({"type": "access", "token": access_token})
        response = await communicator4.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator1.receive_json_from()
        self.assertEqual(response["type"], "users")
        response = await communicator2.receive_json_from()
        self.assertEqual(response["type"], "users")
        response = await communicator3.receive_json_from()
        self.assertEqual(response["type"], "users")
        response = await communicator4.receive_json_from()
        self.assertEqual(response["type"], "users")

        user5 = await self.create_test_user(
            username="testuser5", email="test5@test.com", password="<PASSWORD>"
        )
        token = TokenObtainPairSerializer.get_token(user5)
        access_token = str(token.access_token)
        communicator5 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator5.connect()
        self.assertTrue(connected)
        await communicator5.send_json_to({"type": "access", "token": access_token})
        response = await communicator5.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator5.receive_json_from()
        self.assertEqual(response["type"], "error")

        response = await communicator1.receive_json_from()
        self.assertEqual(response["type"], "start_game")
        response = await communicator2.receive_json_from()
        self.assertEqual(response["type"], "start_game")
        response = await communicator3.receive_json_from()
        self.assertEqual(response["type"], "start_game")
        response = await communicator4.receive_json_from()
        self.assertEqual(response["type"], "start_game")

        # Clean up
        await communicator1.disconnect()
        await communicator2.disconnect()
        await communicator3.disconnect()
        await communicator4.disconnect()
        await communicator5.disconnect()

    async def test_room_connect(self):
        room = await self.create_room("123", "tournament", "map1", 2, "#000000")
        user = await self.create_test_user(
            username="testuser", email="test@test.com", password="1234"
        )
        token = TokenObtainPairSerializer.get_token(user)
        access_token = str(token.access_token)
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)
        await communicator.send_json_to({"type": "access", "token": access_token})
        response = await communicator.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "users")
        # Clean up
        await communicator.disconnect()

    async def test_user_duplicate(self):
        room = await self.create_room("123456", "tournament", "map1", 2, "#000000")
        user = await self.create_test_user(
            username="testuser123", email="test123@test.com", password="1234"
        )
        token = TokenObtainPairSerializer.get_token(user)
        access_token = str(token.access_token)
        communicator1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator1.connect()
        self.assertTrue(connected)
        await communicator1.send_json_to({"type": "access", "token": access_token})
        response = await communicator1.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator1.receive_json_from()
        assert response["type"] == "users"
        communicator2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/tournament_room/{room.id}/",
        )
        connected, subprotocol = await communicator2.connect()
        self.assertTrue(connected)
        await communicator2.send_json_to({"type": "access", "token": access_token})
        response = await communicator2.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        response = await communicator2.receive_json_from()
        self.assertEqual(
            response, {"type": "error", "message": "User already in room."}
        )
        # Clean up
        await communicator1.disconnect()
        await communicator2.disconnect()
