from rest_framework import serializers
from users.models import User
from .models import Friend

class FriendSerializer(serializers.ModelSerializer):
    friend_info = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = ['friend_user', 'friend_info']

    def get_friend_info(self, obj):
        friend_user = obj.friend_user  # This is the User object representing the friend
        return {
            'id': friend_user.id,
            'username': friend_user.username,
            'status': friend_user.is_active,
            'image': friend_user.image if friend_user.image else None,
            'win': friend_user.win,
            'lose': friend_user.lose,
            'comment': friend_user.comment,
        }