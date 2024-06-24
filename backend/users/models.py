from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError("닉네임을 입력하세요")
        if not email:
            raise ValueError("이메일을 입력하세요")
        if not password:
            raise ValueError("비밀번호를 입력하세요")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    # password는 AbstractUser에서 상속 받아 기본 정의 사용
    username = models.CharField(max_length=10, null=False, unique=True)
    email = models.EmailField(max_length=200, null=False)
    is_registered = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=True)
    is_active = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    win = models.IntegerField(default=0)
    lose = models.IntegerField(default=0)
    comment = models.CharField(max_length=20, default="hello!", blank=True)
    image = models.ImageField(
        default="images/default_image.jpeg", null=True, blank=True, upload_to="images/"
    )
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
