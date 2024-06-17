from channels.db import database_sync_to_async
import jwt
from django.conf import settings
from django.apps import apps


class JWTAuthMiddleware:
    @database_sync_to_async
    def get_user(self, jwt_token: str):
        secret_key = settings.SECRET_KEY
        algorithm = settings.ALGORITHM
        decoded_token = jwt.decode(jwt_token, secret_key, algorithms=[algorithm])
        user_email = decoded_token.get("email")
        user_model = apps.get_model("users", "User")
        user = user_model.objects.get(email=user_email)
        return user
