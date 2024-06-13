from django.urls import re_path

from .consumers import NormalRoomConsumer, TournamentRoomConsumer

websocket_urlpatterns = [
    re_path(r"ws/normal_room/(?P<room_id>\w+)/$", NormalRoomConsumer.as_asgi()),
    re_path(r"ws/tournament_room/(?P<room_id>\w+)/$", TournamentRoomConsumer.as_asgi()),
]
