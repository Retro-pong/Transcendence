from django.db import models
from users.models import User
from django.conf import settings


# Create your models here.
class Friend(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="friends"
    )
    friend_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="friend_of"
    )

    def __str__(self):
        return f"{self.user.username} -> {self.friend_user.username}"

    @classmethod
    def create_friend(cls, user, friend_name):
        if not User.objects.filter(username=friend_name).exists():
            raise ValueError("Friend name does not exist.")
        try:
            friend = cls(user=user, friend_user=User.objects.get(username=friend_name))
            friend.save()
            Friend.objects.create(
                user=User.objects.get(username=friend_name), friend_user=user
            )
        except:
            raise ValueError("The user is already your friend.")
        return friend

    @classmethod
    def delete_friend(cls, user, friend_name):
        try:
            friend = cls.objects.get(
                user=user, friend_user=User.objects.get(username=friend_name)
            )
            friend.delete()
            friend_other = cls.objects.get(
                user=User.objects.get(username=friend_name), friend_user=user
            )
            friend_other.delete()
        except cls.DoesNotExist:
            raise ValueError("The user is not your friend.")

    class Meta:
        db_table = "friends"
        unique_together = ("user", "friend_user")


class FriendRequest(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="request_user"
    )
    friend_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="request_friend_user",
    )

    def __str__(self):
        return f"{self.user.username} -> {self.friend_user.username}"

    @classmethod
    def create_request(cls, user, friend_name):
        friend_user = User.objects.get(username=friend_name)
        request = cls(user=user, friend_user=friend_user)
        request.save()

    @classmethod
    def delete_request(cls, user, friend_name):
        try:
            friend_user = User.objects.get(username=friend_name)
            request = cls.objects.get(user=user, friend_user=friend_user)
            request.delete()
        except cls.DoesNotExist:
            raise ValueError("Request not found.")

    class Meta:
        db_table = "friends_request"
        unique_together = ("user", "friend_user")
