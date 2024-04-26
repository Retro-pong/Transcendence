from django.urls import path

from .views import IntraView, EmailLoginView, EmailRegisterView, TestView


app_name = "login"

urlpatterns = [
    path("intra/", IntraView.as_view(), name="intra"),
    path("email/login", EmailLoginView.as_view(), name="email_login"),
    path("email/register", EmailRegisterView.as_view(), name="email_register"),

    path("test/", TestView.as_view(), name="test"),
]
