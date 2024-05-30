from django.db import models
from rooms.models import Room

class GameResult(models.Model):
    winner = models.CharField(max_length=50)
    player1 = models.CharField(max_length=50)
    player2 = models.CharField(max_length=50)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    start_time = models.DateTimeField(null=False, blank=False)
    game_map = models.CharField(max_length=50)
    game_speed = models.IntegerField(default=0)
    ball_color = models.CharField(max_length=50, default='#000000')

    def __str__(self):
        return f'{self.player1} vs {self.player2}'
    class Meta:
        db_table = 'reㅇsults'