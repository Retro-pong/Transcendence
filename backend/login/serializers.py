from rest_framework import serializers
from users.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email"]


# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     """
#     https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html
#     JWT Access Token 생성
#     claim에 담고 싶은 정보 customizing하기 위한 serializer
#     """
#
#     @classmethod
#     def get_token(cls, user):
#         # Get token from parent class
#         token = super().get_token(user)
#         # Add custom claims
#         token["id"] = user.id
#         token["username"] = user.username
#         token["email"] = user.email
#         return token
