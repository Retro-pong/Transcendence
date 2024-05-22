from django.urls import path
from .views import (
    IntraLoginView,
    IntraCallbackView,
    EmailLoginView,
    EmailLoginVerifyView,
    EmailRegisterView,
    EmailRegisterVerifyView,
    LogoutView,
    MyTokenRefreshView,
)


app_name = "login"

urlpatterns = [
    path("intra/login/", IntraLoginView.as_view(), name="intra_login"),
    path("intra/callback/", IntraCallbackView.as_view(), name="intra_callback"),
    path("email/login/", EmailLoginView.as_view(), name="email_login"),
    path(
        "email/login/verify/", EmailLoginVerifyView.as_view(), name="email_login_verify"
    ),
    path("email/register/", EmailRegisterView.as_view(), name="email_register"),
    path(
        "email/register/verify/",
        EmailRegisterVerifyView.as_view(),
        name="email_register_verify",
    ),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", MyTokenRefreshView.as_view(), name="token_refresh"),
]
