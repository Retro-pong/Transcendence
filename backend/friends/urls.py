from django.urls import path
from .views import (
    FriendsListAPIView,
    AddListAPIView,
    WaitingListAPIView,
)
app_name = "friends"

urlpatterns = [
    path("friends/", FriendsListAPIView.as_view(), name="friend_list"),
    #path("/add/", AddListAPIView.as_view(), name="add_list"),
    #path("/waiting/", WaitingListAPIView.as_view(), name="waiting_list"),
]