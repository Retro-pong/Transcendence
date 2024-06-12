from .consumers import GameConsumer
from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase
from .routing import websocket_urlpatterns
from channels.routing import URLRouter
from backend.middleware import JWTAuthMiddleware
from channels.db import database_sync_to_async
from users.model import User
from .model import GameResult

class GameConsumerTest(TransactionTestCase):
    @database_sync_to_async
    def create_test_user(self, username, email, password):
        return User.objects.create_user(username, email, password)

    @database_sync_to_async
    def create_test_result(self,):

