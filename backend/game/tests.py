from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase
from .routing import websocket_urlpatterns
from channels.routing import URLRouter
from channels.db import database_sync_to_async
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import User
from .models import GameResult
from django.utils import timezone


class GameConsumerTest(TransactionTestCase):
    @database_sync_to_async
    def create_test_user(self, username, email, password):
        return User.objects.create_user(username, email, password)

    @database_sync_to_async
    def create_test_result(self, map, speed, color, time):
        return GameResult.objects.create(
            game_map=map,
            game_speed=speed,
            ball_color=color,
            start_time=time,
        )

    @database_sync_to_async
    def get_test_result(self, id):
        return GameResult.objects.get(id=id)

    async def test_game_connect(self):
        # user1, user2, result setup
        result = await self.create_test_result("map", 1, "#000000", timezone.now())
        user1 = await self.create_test_user(
            username="testuser1", email="test1@test.com", password="1234"
        )
        user2 = await self.create_test_user(
            username="test2user", email="test2@test.com", password="1234"
        )
        # user1 connect
        token = TokenObtainPairSerializer.get_token(user1)
        access_token = str(token.access_token)
        communicator1 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_game/{result.id}/",
        )
        connected, subprotocol = await communicator1.connect()
        self.assertTrue(connected)
        await communicator1.send_json_to({"type": "access", "token": access_token})
        response = await communicator1.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        # user2 connect
        token = TokenObtainPairSerializer.get_token(user2)
        access_token = str(token.access_token)
        communicator2 = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f"/ws/normal_game/{result.id}/",
        )
        connected, subprotocol = await communicator2.connect()
        self.assertTrue(connected)
        await communicator2.send_json_to({"type": "access", "token": access_token})
        response = await communicator2.receive_json_from()
        self.assertEqual(response, {"access": "Access successful."})
        # get start data
        response = await communicator1.receive_json_from()
        self.assertEqual(response["color"], "red")
        response = await communicator2.receive_json_from()
        self.assertEqual(response["color"], "blue")

        # send ready
        await communicator1.send_json_to({"type": "ready"})
        await communicator2.send_json_to({"type": "ready"})
        while True:
            response = await communicator2.receive_json_from()
            # if response["type"] == "render":
            #     print(response)
            if response["type"] == "result":
                print(response)
                break
