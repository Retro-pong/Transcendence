from django.db import models
from users.models import User


class GameResult(models.Model):
    winner = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="winner", null=True, blank=True
    )
    player1 = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="player1", null=True, blank=True
    )
    player2 = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="player2", null=True, blank=True
    )
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    start_time = models.DateTimeField(null=False, blank=False)
    game_mode = models.CharField(max_length=50, default="None")  # normal, tournament
    game_map = models.CharField(max_length=50, default="None")
    game_speed = models.IntegerField(default=0)
    ball_color = models.CharField(max_length=50, default="#000000")

    def __str__(self):
        return f"{self.player1} vs {self.player2}"

    class Meta:
        db_table = "results"
