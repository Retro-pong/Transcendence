from django.db import models


class Room(models.Model):
    room_name = models.CharField(max_length=50)
    game_mode = models.CharField(max_length=50)  # rumble, tournament
    game_map = models.CharField(max_length=50)
    game_speed = models.IntegerField()
    current_players = models.IntegerField(default=0)
    max_players = models.IntegerField(default=0)

    @classmethod
    def create_room(cls, room_name, game_mode, game_map, game_speed, max_players):
        if not room_name:
            raise ValueError("Room name cannot be empty")
        if not game_mode:
            raise ValueError("Game mode cannot be empty")
        if not game_map:
            raise ValueError("Game map cannot be empty")
        if not game_speed:
            raise ValueError("Game speed cannot be empty")
        if not max_players:
            raise ValueError("Max players cannot be empty")
        room = cls(
            room_name=room_name,
            game_mode=game_mode,
            game_map=game_map,
            game_speed=game_speed,
            max_players=max_players,
            current_players=1,
        )
        room.save()
        return room

    @classmethod
    def delete_room(cls, room_name):
        try:
            room = cls.objects.get(room_name=room_name)
            room.delete()
        except cls.DoesNotExist:
            raise ValueError("Room not found")

    class Meta:
        db_table = "room"
