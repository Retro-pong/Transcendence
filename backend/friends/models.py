from django.db import models
from users.models import User
from django.conf import settings

# Create your models here.
class Friend(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friends')
    friend_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friend_of')

    @classmethod
    def create_friend(cls, user, friend_name):
        if not User.objects.filter(username=friend_name).exists():
            raise ValueError("Not exist friend name")
        friend = cls(user=user, friend_user=User.objects.get(username=friend_name))
        friend.save()
        return friend

    @classmethod
    def delete_friend(cls, user, friend_name):
        try:
            friend = cls.objects.get(user=user, friend_user=User.objects.get(username=friend_name))
            friend.delete()
        except cls.DoesNotExist:
            raise ValueError("Friend not found")

    class Meta:
        db_table = 'friends'
        unique_together = ('user', 'friend_user')

# class FriendRequest(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     friend_name = models.CharField(max_length=100)
#
#     @classmethod
#     def delete_request(cls, user, friend_name):
#
#     class Meta:
#         db_table = 'friends_request'
