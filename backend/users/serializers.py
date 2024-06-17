from rest_framework import serializers
from users.models import User
from game.models import GameResult
from game.serializers import GameResultSerializer


class ProfileSerializer(serializers.ModelSerializer):
    history = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "image",
            "win",
            "lose",
            "comment",
            "is_active",
            "history",
        )

    def get_history(self, obj):
        user = obj
        results = GameResult.objects.filter(
            player1=user.id
        ) | GameResult.objects.filter(player2=user.id)
        valid_results = [results for results in results if results.winner]
        return GameResultSerializer(valid_results, many=True).data
