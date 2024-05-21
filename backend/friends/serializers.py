from rest_framework import serializers
from users.serializers import ProfileSerializer
from .models import Friend

class FriendSerializer(serializers.ModelSerializer):
    friend_info = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = ['friend_user', 'friend_info']

    def get_friend_info(self, obj):
        friend_user = obj.friend_user  # This is the User object representing the friend
        serializer = ProfileSerializer(friend_user)
        return serializer.data