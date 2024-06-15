from channels.db import database_sync_to_async
import jwt
from django.conf import settings
from django.apps import apps
from django.contrib.auth.models import AnonymousUser

# from channels.middleware import BaseMiddleware

# from asgiref.sync import sync_to_async


class JWTAuthMiddleware:
    #     async def __call__(self, scope, receive, send) -> None:
    #         try:
    #             token = await self.get_token(scope)
    #             user = await self.get_user(token)
    #             scope["user"] = user
    #         except:
    #             user = apps.get_model("users", "User")
    #             anonymous = await sync_to_async(user.objects.create)(
    #                 username="Anonymous",
    #                 is_anonymous=True,
    #                 is_authenticated=False,
    #             )
    #             scope["user"] = anonymous
    #         return await super().__call__(scope, receive, send)
    #
    #     async def get_token(self, scope) -> str:
    #         token = None
    #         headers = dict(scope["headers"])
    #         if b"cookie" in headers:
    #             cookies = headers[b"cookie"].decode()
    #             cookie_list = cookies.split("; ")
    #             for cookie in cookie_list:
    #                 name, value = cookie.split("=")
    #                 if name == "access_token":
    #                     token = value
    #                     break
    #         return token

    @database_sync_to_async
    def get_user(self, jwt_token: str):
        secret_key = settings.SECRET_KEY
        algorithm = settings.ALGORITHM
        decoded_token = jwt.decode(jwt_token, secret_key, algorithms=[algorithm])
        user_email = decoded_token.get("email")
        user_model = apps.get_model("users", "User")
        user = user_model.objects.get(email=user_email)
        return user
