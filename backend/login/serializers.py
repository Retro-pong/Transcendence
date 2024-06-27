from rest_framework import serializers
from users.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data) -> User:
        # username은 unique 속성으로 중복 방지됨
        # email 중복 방지
        try:
            email = validated_data["email"]
            user = User.objects.get(email=email)
            # 이미 가입된 이메일인 경우, 회원가입 실패
            if user.is_registered:
                raise serializers.ValidationError("Email already exists.")
            # 가입되었지만 인증되지 않은 경우, 기존 회원 정보 삭제 후 새로 가입
            else:
                user.delete()
        except User.DoesNotExist:
            pass

        new_user = User.objects.create_user(**validated_data)
        return new_user
