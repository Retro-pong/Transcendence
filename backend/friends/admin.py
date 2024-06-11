from django.contrib import admin
from .models import Friend, FriendRequest

admin.site.register(FriendRequest)
admin.site.register(Friend)  # admin url에서 db확인
# Register your models here.
