from rest_framework import serializers
from users.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     """
#     https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html
#     JWT Access Token 생성
#     claim에 담고 싶은 정보 customize
#     """
#
#     @classmethod
#     def validate(cls, user):
#         # Get token from parent class
#         token = super().get_token(user)
#         # Add custom claims
#         token["id"] = user.id
#         token["username"] = user.username
#         token["email"] = user.email
#         return token
