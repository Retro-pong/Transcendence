from django.urls import re_path

from .consumers import GameConsumer  # GameTournamentConsumer

websocket_urlpatterns = [
    re_path(r"ws/normal_game/(?P<game_id>\w+)/$", GameConsumer.as_asgi()),
    # re_path(r'ws/tournament_game/(?P<game_id>\w+)/$', GameTournamentConsumer.as_asgi()),
]
