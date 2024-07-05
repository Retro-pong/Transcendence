from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from .models import TFA
from users.models import User
from django.conf import settings


def send_verification_code(email) -> bool:
    """
    메일 인증 코드 생성 및 전송
    """
    code = User.objects.make_random_password(length=6)  # 6자리 랜덤 코드 생성
    TFA.objects.create(email=email, code=code)  # DB에 저장

    try:
        # Set up the SMTP server
        smtp = smtplib.SMTP(settings.EMAIL_HOST, int(settings.EMAIL_PORT))
        smtp.starttls()
        smtp.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)

        # Create the email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Verification Code"
        msg["From"] = settings.EMAIL_HOST_USER
        msg["To"] = email

        # Create the body of the email with HTML
        html_content = f"""
        <html>
        <body>
            <p style="font-size: 16px; color: #333;">
                Your verification code is <strong style="color: #ea04ec;">{code}</strong>
                <br />Enjoy your <strong style="color: #02ffff;">PONG</strong><b>!</b>
            </p>
        </body>
        </html>
        """

        # Attach the HTML content to the email
        msg.attach(MIMEText(html_content, "html"))

        # Send the email
        smtp.sendmail(
            settings.EMAIL_HOST_USER,
            email,
            msg.as_string(),
        )
        smtp.quit()
        return True
    except Exception as e:
        return False


def verify_email(request) -> str:
    """
    메일 인증 코드 검증
    """
    email = request.data.get("email")
    code = request.data.get("code")
    tfa = TFA.objects.filter(email=email).first()

    # Got the correct verification code
    if tfa and tfa.code == code:
        # 해당 이메일에 대해 모든 발신 기록 삭제 후 로그인
        TFA.objects.filter(email=email).delete()
        return email
    return str()


def obtain_jwt_token(user) -> Response:
    token = TokenObtainPairSerializer.get_token(user)
    refresh_token = str(token)
    access_token = str(token.access_token)
    response = Response(
        {
            "message": "Login successful",
            "email": user.email,
            "access_token": access_token,
        },
        status=status.HTTP_200_OK,
    )
    response.set_cookie("refresh_token", refresh_token, httponly=True)

    return response
