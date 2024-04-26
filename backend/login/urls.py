from django.urls import path

from .views import IntraLoginView, IntraRegisterView, EmailLoginView, EmailRegisterView, TestView


app_name = "login"

urlpatterns = [
    path("intra/login/", IntraLoginView.as_view(), name="intra_login"),
    path("intra/register/", IntraRegisterView.as_view(), name="intra_register"),
    path("email/login", EmailLoginView.as_view(), name="email_login"),
    path("email/register", EmailRegisterView.as_view(), name="email_register"),

    path("test/", TestView.as_view(), name="test"),
]
