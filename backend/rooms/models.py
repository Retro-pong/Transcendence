from django.db import models


class Room(models.Model):
    room_name = models.CharField(max_length=12, unique=True)
    game_mode = models.CharField(max_length=50)  # normal, tournament
    game_map = models.CharField(max_length=50, default="None")
    game_speed = models.IntegerField(default=0)
    current_players = models.IntegerField(default=0)
    ball_color = models.CharField(max_length=50, default="#000000")

    def __str__(self):
        return f"{self.room_name}"

    @classmethod
    def create_room(cls, room_name, game_mode, game_map, game_speed, game_ball):
        if not room_name:
            raise ValueError("Room name cannot be empty")
        if not game_mode:
            raise ValueError("Game mode cannot be empty")
        if not game_map:
            raise ValueError("Game map cannot be empty")
        if not game_speed:
            raise ValueError("Game speed cannot be empty")
        if not game_ball:
            raise ValueError("Max players cannot be empty")
        room = cls(
            room_name=room_name,
            game_mode=game_mode,
            game_map=game_map,
            game_speed=game_speed,
            ball_color=game_ball,
            current_players=1,
        )
        room.save()
        return room

    class Meta:
        db_table = "room"
