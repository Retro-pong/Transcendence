from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Room
from users.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .consumers import RoomConsumer
from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase
from backend.asgi import application


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


class RoomConsumerTest(TransactionTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="1234"
        )
        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        self.access_token = str(token.access_token)

    async def test_room_connect(self):
        communicator = WebsocketCommunicator(
            application,
            "/ws/normal_room/1/",
            headers=[(b"cookie", f"access_token={self.access_token}")],
        )
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)

        # Clean up
        await communicator.disconnect()

    async def test_room_connect_full(self):
        # Connect the first client
        communicator1 = WebsocketCommunicator(
            application,
            "/ws/normal_room/1/",
            headers=[(b"cookie", f"access_token={self.access_token}".encode())],
        )
        connected1, subprotocol1 = await communicator1.connect()
        self.assertTrue(connected1)

        # Connect the second client
        communicator2 = WebsocketCommunicator(
            application,
            "/ws/normal_room/1/",
            headers=[(b"cookie", f"access_token={self.access_token}".encode())],
        )
        connected2, subprotocol2 = await communicator2.connect()
        self.assertTrue(connected2)

        # Try to connect the third client, which should fail
        communicator3 = WebsocketCommunicator(
            application,
            "/ws/normal_room/1/",
            headers=[(b"cookie", f"access_token={self.access_token}".encode())],
        )
        connected3, subprotocol3 = await communicator3.connect()
        self.assertFalse(connected3)

        # Clean up
        await communicator1.disconnect()
        await communicator2.disconnect()
        await communicator3.disconnect()

    async def test_room_disconnect(self):
        communicator = WebsocketCommunicator(
            application,
            "/ws/normal_room/1/",
            headers=[(b"cookie", f"access_token={self.access_token}".encode())],
        )
        connected, subprotocol = await communicator.connect()

        self.assertTrue(connected)

        await communicator.disconnect()

        # Verify the room is empty after disconnect
        self.assertNotIn("/ws/normal_room/1/", RoomConsumer.rooms)
