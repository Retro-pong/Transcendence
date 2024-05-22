from django.urls import path
from .views import (
    JoinRoomAPIView,
    CreateRoomAPIView,
)


app_name = "room"

urlpatterns = [
    path("join/", JoinRoomAPIView.as_view(), name="join_room"),
    path("create/", CreateRoomAPIView.as_view(), name="create_room"),
]
