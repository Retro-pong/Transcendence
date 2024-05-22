from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Room
from .serializers import RoomSerializer
from users.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class JoinRoomAPIViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )

        self.user.is_authenticated = True
        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()

        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

        # Create test rooms
        Room.objects.create(
            room_name="Room1",
            game_mode="rumble",
            game_speed=1,
            game_map="map1",
            max_players=4,
        )
        Room.objects.create(
            room_name="Room2",
            game_mode="tournament",
            game_speed=5,
            game_map="map2",
            max_players=2,
        )

    def test_get_rooms(self):
        url = reverse("room:join_room")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        room_names = [room["room_name"] for room in response.data]
        self.assertIn("Room1", room_names)
        self.assertIn("Room2", room_names)


class CreateRoomAPIViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )

        self.user.is_authenticated = True
        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()

        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

    def test_create_room(self):
        url = reverse("room:create_room")
        data = {
            "room_name": "NewRoom",
            "game_mode": "rumble",
            "game_speed": 3,
            "game_map": "map2",
            "max_players": 4,
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