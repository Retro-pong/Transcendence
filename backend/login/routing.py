from django.urls import path

from .consumers import LoginConsumer

websocket_urlpatterns = [
    path("ws/login/", LoginConsumer.as_asgi()),
]
