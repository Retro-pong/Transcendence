from django.urls import path
from .views import (
    ProfileView,
    ProfileEditView,
    ProfileUploadView,
)

app_name = "users"

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/edit/", ProfileEditView.as_view(), name="profile_edit"),
    path("profile/upload/", ProfileUploadView.as_view(), name="profile_upload"),
]
