from rest_framework import serializers
from .models import TFA
from users.models import User
from django.shortcuts import get_object_or_404


class TfaSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get("email")
        code = data.get("code")
        verify = get_object_or_404(TFA, email=email)
        if verify.code == code:
            verify.delete()
            return data
        else:
            raise serializers.ValidationError("Code verification failed.")


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
