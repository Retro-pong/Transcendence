from rest_framework import serializers
from users.models import User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "image", "win", "lose", "comment", "is_active")
