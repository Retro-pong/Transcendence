from django.urls import path
from .views import (
    IntraView,
    EmailLoginView,
    EmailRegisterView,
    EmailVerifyView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


app_name = "login"

urlpatterns = [
    path("intra/", IntraView.as_view(), name="intra"),
    path("email/register", EmailRegisterView.as_view(), name="email_register"),
    path("email/login", EmailLoginView.as_view(), name="email_login"),
    path("email/verify", EmailVerifyView.as_view(), name="email_verify"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]