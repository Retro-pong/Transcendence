from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from rest_framework import status
import jwt
import datetime


# def get_jwt_token(user) -> str:
#     payload = {
#         "user_id": user.id,
#         "email": user.email,
#         "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
#     }
#     token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
#     return token.decode("utf-8")


def generate_jwt_token(user) -> Response:
    token = TokenObtainPairSerializer.get_token(user)
    refresh_token = str(token)
    access_token = str(token.access_token)
    response = Response(
        {
            "message": "Login successful",
            "user": user.username,
            "jwt": {
                "access_token": access_token,
                "refresh_token": refresh_token,
            },
        },
        status=status.HTTP_200_OK,
    )
    response.set_cookie("refresh_token", refresh_token, httponly=True)
    response.set_cookie("access_token", access_token, httponly=True)
    return response
