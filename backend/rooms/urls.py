from django.urls import path
from .views import (
    JoinNormalRoomAPIView,
    JoinTournamentRoomAPIView,
    CreateRoomAPIView,
)


app_name = "room"

urlpatterns = [
    path("join/normal/", JoinNormalRoomAPIView.as_view(), name="join_normal"),
    path(
        "join/tournament/", JoinTournamentRoomAPIView.as_view(), name="join_tournament"
    ),
    path("create/", CreateRoomAPIView.as_view(), name="create_room"),
]
