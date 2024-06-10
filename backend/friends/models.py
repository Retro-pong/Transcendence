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
            raise ValueError("Not exist friend name.")
        friend = cls(user=user, friend_user=User.objects.get(username=friend_name))
        friend.save()
        Friend.objects.create(
            user=User.objects.get(username=friend_name), friend_user=user
        )
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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    friend_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} -> {self.friend_name}"

    @classmethod
    def create_request(cls, user, friend_name):
        request = cls(user=user, friend_name=friend_name)
        request.save()

    @classmethod
    def delete_request(cls, user, friend_name):
        request = cls.objects.get(user=user, friend_name=friend_name)
        if request.DoesNotExist:
            raise ValueError("Request not found.")
        request.delete()

    class Meta:
        db_table = "friends_request"
        unique_together = ("user", "friend_name")
