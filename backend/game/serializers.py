from rest_framework import serializers
from .models import GameResult


class GameResultSerializer(serializers.ModelSerializer):
    winner_username = serializers.SerializerMethodField()
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()

    class Meta:
        model = GameResult
        fields = (
            "winner_username",
            "player1_username",
            "player2_username",
            "player1_score",
            "player2_score",
            "start_time",
        )

    def get_winner_username(self, obj):
        return obj.winner.username

    def get_player1_username(self, obj):
        return obj.player1.username

    def get_player2_username(self, obj):
        return obj.player2.username
