from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.apps import apps
from backend.middleware import JWTAuthMiddleware


class LoginConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive_json(self, content):
        if content["type"] == "access":
            token = content["token"]
            try:
                self.user = await JWTAuthMiddleware.get_user(token)
                self.user_id = self.user.id
            except:
                await self.send_json({"access": "User invalid or expired."})
                return
            if not self.user.is_authenticated:
                await self.send_json({"access": "User not authenticated."})
            else:
                await self.send_json({"access": "Access successful."})
                await self.change_status(True)

    async def disconnect(self, code):
        await self.change_status(False)
        await self.close()

    @database_sync_to_async
    def change_status(self, status):
        user_model = apps.get_model("users", "User")
        user = user_model.objects.get(id=self.user_id)
        user.is_active = status
        user.save()
        return user
