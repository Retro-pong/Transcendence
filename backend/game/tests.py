from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase
# from backend.asgi import application
from .models import GameResult
from django.contrib.auth.models import User
from django.utils import timezone

class GameConsumerTest(TransactionTestCase):
    async def test_connect_and_receive_ready(self):
        # Create a game result for the test
        game_result = GameResult.objects.create(
            winner="",
            player1="player1",
            player2="player2",
            player1_score=0,
            player2_score=0,
            start_time=timezone.now(),
            game_map="default_map",
            game_speed=1,
            ball_color="#FFFFFF"
        )

        # Create a test user
        user = User.objects.create_user(username='player1', password='password')

        # Create the communicator to the application
        communicator = WebsocketCommunicator(application, f"/ws/game/{game_result.id}/")
        connected, subprotocol = await communicator.connect()

        # Assert connection
        self.assertTrue(connected)

        # Send JSON message
        await communicator.send_json_to({"type": "ready"})

        # Receive JSON message
        response = await communicator.receive_json_from()

        # Assert response data
        self.assertEqual(response["type"], "start")
        self.assertEqual(response["color"], "red")
        self.assertEqual(response["map"], game_result.game_map)
        self.assertEqual(response["ball_color"], game_result.ball_color)

        # Clean up
        await communicator.disconnect()
