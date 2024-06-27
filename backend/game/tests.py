import asyncio

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
    def create_test_result(self, map, mode, speed, color, time):
        return GameResult.objects.create(
            game_map=map,
            game_mode=mode,
            game_speed=speed,
            ball_color=color,
            start_time=time,
        )

    @database_sync_to_async
    def get_test_result(self, id):
        return GameResult.objects.get(id=id)

    # async def test_opponent_not_connect(self):
    #     # user1, user2, result setup
    #     result = await self.create_test_result(
    #         "map", "normal", 1, "#000000", timezone.now()
    #     )
    #     user1 = await self.create_test_user(
    #         username="testuser1", email="test1@test.com", password="1234"
    #     )
    #     user2 = await self.create_test_user(
    #         username="test2user", email="test2@test.com", password="1234"
    #     )
    #     # user1 connect
    #     token = TokenObtainPairSerializer.get_token(user1)
    #     access_token = str(token.access_token)
    #     communicator1 = WebsocketCommunicator(
    #         URLRouter(websocket_urlpatterns),
    #         f"/ws/normal_game/{result.id}/",
    #     )
    #     connected, subprotocol = await communicator1.connect()
    #     self.assertTrue(connected)
    #     await communicator1.send_json_to({"type": "access", "token": access_token})
    #     response = await communicator1.receive_json_from()
    #     self.assertEqual(response, {"access": "Access successful."})
    #     # get start data
    #     response = await communicator1.receive_json_from()
    #     self.assertEqual(response["color"], "red")
    # user2 connect
    # token = TokenObtainPairSerializer.get_token(user2)
    # access_token = str(token.access_token)
    # communicator2 = WebsocketCommunicator(
    #     URLRouter(websocket_urlpatterns),
    #     f"/ws/normal_game/{result.id}/",
    # )
    # connected, subprotocol = await communicator2.connect()
    # self.assertTrue(connected)
    # await communicator2.send_json_to({"type": "access", "token": access_token})
    # response = await communicator2.receive_json_from()
    # self.assertEqual(response, {"access": "Access successful."})
    # # send ready
    # await communicator2.disconnect()
    # await communicator1.send_json_to({"type": "ready"})
    # await asyncio.sleep(12)
    # response = await communicator1.receive_json_from()
    # self.assertEqual(response["type"], "error")

    #
    async def test_game_connect(self):
        # user1, user2, result setup
        result = await self.create_test_result(
            "map", "normal", 1, "#000000", timezone.now()
        )
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
        # await communicator2.send_json_to({"type": "access", "token": access_token})
        # response = await communicator2.receive_json_from()
        # self.assertEqual(response, {"access": "Access successful."})
        # get start data
        response = await communicator1.receive_json_from()
        self.assertEqual(response["color"], "red")
        # response = await communicator2.receive_json_from()
        # self.assertEqual(response["color"], "blue")
        await communicator2.disconnect()
        # send ready
        # await communicator1.send_json_to({"type": "ready"})
        # await communicator2.send_json_to({"type": "ready"})
        # while True:
        #     response = await communicator2.receive_json_from()
        #     if response["type"] == "render":
        #         self.assertEqual(response["redNick"], "testuser1")
        #     if response["type"] == "result":
        #         self.assertEqual(response["redNick"], "testuser1")
        #         break

    #
    # async def test_disconnection(self):
    #     # user1, user2, result setup
    #     result = await self.create_test_result(
    #         "map", "normal", 1, "#000000", timezone.now()
    #     )
    #     user1 = await self.create_test_user(
    #         username="testuser1", email="test1@test.com", password="1234"
    #     )
    #     user2 = await self.create_test_user(
    #         username="test2user", email="test2@test.com", password="1234"
    #     )
    #     # user1 connect
    #     token = TokenObtainPairSerializer.get_token(user1)
    #     access_token = str(token.access_token)
    #     communicator1 = WebsocketCommunicator(
    #         URLRouter(websocket_urlpatterns),
    #         f"/ws/normal_game/{result.id}/",
    #     )
    #     connected, subprotocol = await communicator1.connect()
    #     self.assertTrue(connected)
    #     await communicator1.send_json_to({"type": "access", "token": access_token})
    #     response = await communicator1.receive_json_from()
    #     self.assertEqual(response, {"access": "Access successful."})
    #     # user2 connect
    #     token = TokenObtainPairSerializer.get_token(user2)
    #     access_token = str(token.access_token)
    #     communicator2 = WebsocketCommunicator(
    #         URLRouter(websocket_urlpatterns),
    #         f"/ws/normal_game/{result.id}/",
    #     )
    #     connected, subprotocol = await communicator2.connect()
    #     self.assertTrue(connected)
    #     await communicator2.send_json_to({"type": "access", "token": access_token})
    #     response = await communicator2.receive_json_from()
    #     self.assertEqual(response, {"access": "Access successful."})
    #     # get start data
    #     response = await communicator1.receive_json_from()
    #     self.assertEqual(response["color"], "red")
    #     response = await communicator2.receive_json_from()
    #     self.assertEqual(response["color"], "blue")
    #     await communicator1.send_json_to({"type": "ready"})
    #     await communicator2.send_json_to({"type": "ready"})
    #     await communicator2.disconnect()
    #     while True:
    #         response = await communicator1.receive_json_from()
    #         if response["type"] == "render":
    #             self.assertEqual(response["redNick"], "testuser1")
    #         if response["type"] == "result":
    #             print(response)
    #             self.assertEqual(response["redNick"], "testuser1")
    #             break


#
# class TournamentConsumerTest(GameConsumerTest):
#     async def test_semi_final(self):
#         result1 = await self.create_test_result(
#             "map", "tournament", 1, "#000000", timezone.now()
#         )
#         result2 = await self.create_test_result(
#             "map", "tournament", 1, "#000000", timezone.now()
#         )
#         result3 = await self.create_test_result(
#             "map", "tournament", 1, "#000000", timezone.now()
#         )
#         user1 = await self.create_test_user(
#             username="testuser1", email="test1@test.com", password="1234"
#         )
#         user2 = await self.create_test_user(
#             username="test2user", email="test2@test.com", password="1234"
#         )
#         user3 = await self.create_test_user(
#             username="testuser3", email="test3@test.com", password="1234"
#         )
#         user4 = await self.create_test_user(
#             username="testuser4", email="test4@test.com", password="1234"
#         )
#         # user1 connect
#         token = TokenObtainPairSerializer.get_token(user1)
#         access_token = str(token.access_token)
#         communicator1 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result1.id}/{result2.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator1.connect()
#         self.assertTrue(connected)
#         await communicator1.send_json_to({"type": "access", "token": access_token})
#         response = await communicator1.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # user2 connect
#         token = TokenObtainPairSerializer.get_token(user2)
#         access_token = str(token.access_token)
#         communicator2 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result1.id}/{result2.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator2.connect()
#         self.assertTrue(connected)
#         await communicator2.send_json_to({"type": "access", "token": access_token})
#         response = await communicator2.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # user3 connect
#         token = TokenObtainPairSerializer.get_token(user3)
#         access_token = str(token.access_token)
#         communicator3 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result2.id}/{result1.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator3.connect()
#         self.assertTrue(connected)
#         await communicator3.send_json_to({"type": "access", "token": access_token})
#         response = await communicator3.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # user4 connect
#         token = TokenObtainPairSerializer.get_token(user4)
#         access_token = str(token.access_token)
#         communicator4 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result2.id}/{result1.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator4.connect()
#         self.assertTrue(connected)
#         await communicator4.send_json_to({"type": "access", "token": access_token})
#         response = await communicator4.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # get start data
#         response = await communicator1.receive_json_from()
#         self.assertEqual(response["color"], "red")
#         response = await communicator2.receive_json_from()
#         self.assertEqual(response["color"], "blue")
#         response = await communicator3.receive_json_from()
#         self.assertEqual(response["color"], "red")
#         response = await communicator4.receive_json_from()
#         self.assertEqual(response["color"], "blue")
#         await communicator1.send_json_to({"type": "ready"})
#         await communicator2.send_json_to({"type": "ready"})
#         await communicator3.send_json_to({"type": "ready"})
#         await communicator4.send_json_to({"type": "ready"})
#         while True:
#             response = await communicator2.receive_json_from()
#             response = await communicator1.receive_json_from()
#             if response["type"] == "render":
#                 self.assertEqual(response["redNick"], "testuser1")
#             if response["type"] == "result":
#                 # print(response)
#                 self.assertEqual(response["redNick"], "testuser1")
#                 break
#         while True:
#             response = await communicator3.receive_json_from()
#             response = await communicator4.receive_json_from()
#             if response["type"] == "render":
#                 continue
#             if response["type"] == "result":
#                 # print(response)
#                 break
#         response = await communicator1.receive_json_from(1000)
#         print(response)
#         response = await communicator2.receive_json_from(1000)
#         print(response)
#         response = await communicator3.receive_json_from(1000)
#         print(response)
#         response = await communicator4.receive_json_from(1000)
#         print(response)
#
#     async def test_semi_final_disconnect(self):
#         result1 = await self.create_test_result(
#             "map", "tournament", 1, "#000000", timezone.now()
#         )
#         result2 = await self.create_test_result(
#             "map", "tournament", 1, "#000000", timezone.now()
#         )
#         result3 = await self.create_test_result(
#             "map", "tournament", 1, "#000000", timezone.now()
#         )
#         user1 = await self.create_test_user(
#             username="testuser1", email="test1@test.com", password="1234"
#         )
#         user2 = await self.create_test_user(
#             username="test2user", email="test2@test.com", password="1234"
#         )
#         user3 = await self.create_test_user(
#             username="testuser3", email="test3@test.com", password="1234"
#         )
#         user4 = await self.create_test_user(
#             username="testuser4", email="test4@test.com", password="1234"
#         )
#         # user1 connect
#         token = TokenObtainPairSerializer.get_token(user1)
#         access_token = str(token.access_token)
#         communicator1 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result1.id}/{result2.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator1.connect()
#         self.assertTrue(connected)
#         await communicator1.send_json_to({"type": "access", "token": access_token})
#         response = await communicator1.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # user2 connect
#         token = TokenObtainPairSerializer.get_token(user2)
#         access_token = str(token.access_token)
#         communicator2 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result1.id}/{result2.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator2.connect()
#         self.assertTrue(connected)
#         await communicator2.send_json_to({"type": "access", "token": access_token})
#         response = await communicator2.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # user3 connect
#         token = TokenObtainPairSerializer.get_token(user3)
#         access_token = str(token.access_token)
#         communicator3 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result2.id}/{result1.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator3.connect()
#         self.assertTrue(connected)
#         await communicator3.send_json_to({"type": "access", "token": access_token})
#         response = await communicator3.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # user4 connect
#         token = TokenObtainPairSerializer.get_token(user4)
#         access_token = str(token.access_token)
#         communicator4 = WebsocketCommunicator(
#             URLRouter(websocket_urlpatterns),
#             f"/ws/semi_final_game/{result2.id}/{result1.id}/{result3.id}/",
#         )
#         connected, subprotocol = await communicator4.connect()
#         self.assertTrue(connected)
#         await communicator4.send_json_to({"type": "access", "token": access_token})
#         response = await communicator4.receive_json_from()
#         self.assertEqual(response, {"access": "Access successful."})
#         # get start data
#         response = await communicator1.receive_json_from()
#         self.assertEqual(response["color"], "red")
#         response = await communicator2.receive_json_from()
#         self.assertEqual(response["color"], "blue")
#         response = await communicator3.receive_json_from()
#         self.assertEqual(response["color"], "red")
#         response = await communicator4.receive_json_from()
#         self.assertEqual(response["color"], "blue")
#         await communicator1.send_json_to({"type": "ready"})
#         await communicator2.send_json_to({"type": "ready"})
#         await communicator3.send_json_to({"type": "ready"})
#         await communicator4.send_json_to({"type": "ready"})
#         await communicator2.disconnect()
#         while True:
#             response = await communicator3.receive_json_from()
#             if response["type"] == "render":
#                 self.assertEqual(response["redNick"], "testuser3")
#             if response["type"] == "result":
#                 # print(response)
#                 self.assertEqual(response["redNick"], "testuser3")
#                 break
#         response = await communicator3.receive_json_from(1000000)
#         # print(response)
