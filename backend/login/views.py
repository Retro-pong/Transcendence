from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import render
from django.http import JsonResponse
from .serializers import RegisterSerializer
from users.models import User
from django.contrib.auth import authenticate


class IntraView(APIView):
    def get(self, request):
        return Response("intra")


class EmailLoginView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="email 로그인",  # 기능 설명
        manual_parameters=[
            openapi.Parameter('email', openapi.IN_QUERY, description="Email", type=openapi.TYPE_STRING),
            openapi.Parameter('pw', openapi.IN_QUERY, description="Password", type=openapi.TYPE_STRING)
    ],
        responses={400: "BAD_REQUEST", 500: "SERVER_ERROR"},  # 할당된 요청
    )
    def get(self, request):
        email = request.query_params.get('email')
        password = request.query_params.get('pw')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        # 사용자를 찾았으면 비밀번호를 확인하여 인증
        if user.check_password(password):
            # 인증에 성공하면 여기에서 작업을 수행 TODO: jwt 토큰 추가하여 반환
            return Response({"message": "Login successful", "user": user.username})
        else:
            # 비밀번호가 일치하지 않으면 오류 메시지를 반환
            return Response({"error": "Authentication failed. Invalid password."}, status=status.HTTP_400_BAD_REQUEST)


class EmailRegisterView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="email 회원가입",  # 기능 설명
        request_body=RegisterSerializer,
        responses={400: "BAD_REQUEST", 500: "SERVER_ERROR"},  # 할당된 요청
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # 유효한 데이터일 경우 저장
            username = serializer.data.get('username')
            email = serializer.data.get('email')
            password = serializer.validated_data['password']
            user = User.objects.create_user(username=username, email=email, password=password)
            return Response("User created")
        else:
            errors = serializer.errors
            return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)


class TestView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="Register/login test용",  # 기능 설명
        manual_parameters=[
            openapi.Parameter(
                "user",
                openapi.IN_QUERY,
                description="username",
                type=openapi.TYPE_STRING,
            )
        ],  # 인자 형식
    )
    def get(self, request):
        try:
            user = User.objects.get(username=request.query_params.get("user"))
            return Response({"user:" + user.username})
        except User.DoesNotExist:
            return Response("No such user:")
