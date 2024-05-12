from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
import smtplib
from .models import TFA
from users.models import User
import os


def send_verification_code(email) -> bool:
    """
    2차 인증 코드를 생성하고 이메일로 전송
    """
    code = User.objects.make_random_password(length=6)  # 6자리 랜덤 코드 생성
    TFA.objects.create(email=email, code=code)  # DB에 저장

    try:
        smtp = smtplib.SMTP(
            os.environ.get("EMAIL_HOST"), int(os.environ.get("EMAIL_PORT"))
        )
        smtp.starttls()
        smtp.login(
            os.environ.get("EMAIL_HOST_USER"), os.environ.get("EMAIL_HOST_PASSWORD")
        )
        smtp.sendmail(
            os.environ.get("EMAIL_HOST_USER"),
            email,
            f"Your verification code is <{code}>",
        )
        smtp.quit()
        return True
    except Exception as e:
        return False


def obtain_jwt_token(user) -> Response:
    token = TokenObtainPairSerializer.get_token(user)
    refresh_token = str(token)
    access_token = str(token.access_token)
    # JWT.objects.create(user=user, refresh_token=refresh_token)
    response = Response(
        {
            "message": "Login successful",
            "email": user.email,
            "jwt": {
                "access_token": access_token,
                "refresh_token": refresh_token,
            },
        },
        status=status.HTTP_200_OK,
    )
    return response


# def get_jwt_token(user) -> str:
#     payload = {
#         "user_id": user.id,
#         "email": user.email,
#         "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
#     }
#     token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
#     return token.decode("utf-8")
