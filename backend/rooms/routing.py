from django.urls import re_path

from .consumers import RoomConsumer  # GameTournamentConsumer

websocket_urlpatterns = [
    re_path(r"ws/normal_room/?P<room_id>\w+)/$", RoomConsumer.as_asgi()),
    # re_path(r'ws/tournament_room/(?P<room_id>\w+)/$', GameTournamentConsumer.as_asgi()),
]
