from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models


class UserManager(BaseUserManager):
    # Overriding the create_user method
    def create_user(self, username, email, password):
        if not username:
            raise ValueError("닉네임을 입력하세요")
        if not email:
            raise ValueError("이메일을 입력하세요")
        if not password:
            raise ValueError("비밀번호를 입력하세요")
        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractUser):
    # password, is_active는 AbstractUser에서 상속 받아 기본 정의 사용
    username = models.CharField(max_length=10, null=False, unique=True)
    email = models.EmailField(max_length=20, null=False, unique=True)
    is_authenticated = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "username"  # 주 식별자 필드
    REQUIRED_FIELDS = ["email", "password"]  # 필수 입력 필드

    class Meta:
        db_table = "users"

    # 기본 내장 auth 앱의 User 모델과 사용자 정의 users 앱의 User 모델 사이의 충돌 방지
    groups = models.ManyToManyField(Group, related_name="custom_user_set")
    user_permissions = models.ManyToManyField(
        Permission, related_name="custom_user_set"
    )
