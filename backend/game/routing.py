from django.urls import re_path

from .consumers import NormalGameConsumer  # , TournamentGameConsumer


websocket_urlpatterns = [
    re_path(r"ws/normal_game/(?P<game_id>\w+)/$", NormalGameConsumer.as_asgi()),
    # re_path(r"ws/tournament_game/(?P<game_id>\w+)/$", TournamentGameConsumer.as_asgi()),
]
