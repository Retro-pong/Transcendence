from django.urls import path
from .views import (
    IntraView,
    EmailLoginView,
    EmailLoginVerifyView,
    EmailRegisterView,
    EmailRegisterVerifyView,
    EmailLogoutView,
)
from rest_framework_simplejwt.views import TokenRefreshView


app_name = "login"

urlpatterns = [
    path("intra/", IntraView.as_view(), name="intra"),
    path(
        "email/logout/", EmailLogoutView.as_view(), name="email_logout"
    ),  # TODO: delete (for test)
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
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
