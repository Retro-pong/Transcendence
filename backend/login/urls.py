from django.urls import path
from .views import (
    IntraView,
    EmailLoginView,
    EmailRegisterView,
    SendVerificationCodeView,
    TestView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


app_name = "login"

urlpatterns = [
    path("intra/", IntraView.as_view(), name="intra"),
    path("email/login", EmailLoginView.as_view(), name="email_login"),
    path("email/register", EmailRegisterView.as_view(), name="email_register"),
    path("verify/", SendVerificationCodeView.as_view(), name="verify"),
    path("test/", TestView.as_view(), name="test"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
