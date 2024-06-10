from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.apps import apps


class LoginConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            await self.accept()
            await self.change_status(True)
        else:
            await self.close()

    async def disconnect(self, code):
        await self.change_status(False)
        await self.close()

    @database_sync_to_async
    def change_status(self, status):
        user_model = apps.get_model("users", "User")
        user = user_model.objects.get(username=self.user.username)
        user.is_active = status
        user.save()
        return user
