from rest_framework import serializers
from .models import GameResult


class GameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = (
            "winner",
            "player1",
            "player2",
            "player1_score",
            "player2_score",
            "start_time",
        )
