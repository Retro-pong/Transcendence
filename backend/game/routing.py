from django.urls import re_path

from .consumers import NormalGameConsumer, SemiFinalGameConsumer


websocket_urlpatterns = [
    re_path(r"ws/normal_game/(?P<game_id>\w+)/$", NormalGameConsumer.as_asgi()),
    re_path(r"ws/semi_final_game/(?P<game_id>\w+)/$", SemiFinalGameConsumer.as_asgi()),
    re_path(r"ws/final_game/(?P<game_id>\w+)/$", SemiFinalGameConsumer.as_asgi()),
]
