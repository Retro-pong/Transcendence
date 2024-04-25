from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
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


# Create your models here.
class User(AbstractUser):
    groups = None
    user_permissions = None

    USERNAME_FIELD = "username"  # username을 주 식별자로 사용

    object = UserManager()

    class Meta:
        db_table = "users"
