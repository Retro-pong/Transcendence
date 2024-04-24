from django.urls import path

from .views import IntraView, EmailView, TestView


app_name = "login"

urlpatterns = [
    path("intra/", IntraView.as_view(), name="intra_login"),
    path("email/", EmailView.as_view(), name="email_login"),
    path("test/", TestView.as_view(), name="test"),
]
