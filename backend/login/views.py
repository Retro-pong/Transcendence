from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import JsonResponse
from .serializers import RegisterSerializer
from .models import TFA
from users.models import User
from django.core.mail import EmailMessage
import ssl
import smtplib
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.shortcuts import render


class IntraView(APIView):
    def get(self, request):
        return Response("intra")


class EmailRegisterView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="email 회원가입",  # 기능 설명
        request_body=RegisterSerializer,
        responses={400: "BAD_REQUEST", 500: "SERVER_ERROR"},  # 할당된 요청
    )
    def post(self, request):
        # If email already exists, return error
        email = request.data.get("email")
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)


class EmailLoginView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="email 로그인",  # 기능 설명
        manual_parameters=[
            openapi.Parameter(
                "email", openapi.IN_QUERY, description="Email", type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "password",
                openapi.IN_QUERY,
                description="Password",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={400: "BAD_REQUEST", 500: "SERVER_ERROR"},  # 할당된 요청
    )
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(email=email, password=password)
        if user is not None:
            # # SSL 검증 무시 TODO: delete
            # context = ssl.create_default_context()
            # context.check_hostname = False
            # context.verify_mode = ssl.CERT_NONE
            #
            # # 이후 verification을 위해 DB에 저장
            # code = User.objects.make_random_password(length=6)
            # TFA.objects.create(email=email, code=code)
            #
            # # 메일 전송
            # # message = EmailMessage(
            # #     subject="Verification code",
            # #     body=f"Your verification code is {code}",
            # #     to=[email],
            # # )
            # # message.send()
            # with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            #     server.login("retropong2024@gmail.com", "oygp lmtb vmhk uqba")
            #     server.send(code)
            return Response("Login successful.", status=status.HTTP_200_OK)
        else:
            return Response(
                "Check your email or password.", status=status.HTTP_400_BAD_REQUEST
            )


class EmailVerifyView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="email 인증",  # 기능 설명
        manual_parameters=[
            openapi.Parameter(
                "email", openapi.IN_QUERY, description="Email", type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                "code",
                openapi.IN_QUERY,
                description="Verification code",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={  # 할당된 요청
            400: "BAD_REQUEST",
            404: "NOT_FOUND",
            500: "SERVER_ERROR",
        },
    )
    def post(self, request):
        email = request.query_params.get("email")
        verify = get_object_or_404(TFA, email=email)
        code = request.data.get("code")
        if verify.code == code:
            verify.delete()
            User.objects.filter(email=email).update(is_authenticated=True)
            return Response({"message": "Email verification successful."})
        else:
            return Response(
                {"error": "Email verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
