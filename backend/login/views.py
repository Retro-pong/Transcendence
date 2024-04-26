from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import render
from django.http import JsonResponse
from .serializers import RegisterSerializer
from users.models import User


class IntraLoginView(APIView):
    def get(self, request):
        return Response("intra")

class IntraRegisterView(APIView):
    def post(self, request):
        return Response("intra")

class EmailLoginView(APIView):
    def post(self, request):
        return Response("email")


class EmailRegisterView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="",  # 기능 설명
        request_body=RegisterSerializer,
        responses={},  # 할당된 요청
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # 유효한 데이터일 경우, 저장
            serializer.save()
            return Response("good access")
        else:
            # 유효하지 않은 데이터일 경우 에러 메시지 반환
            return Response(serializer.errors)


class TestView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="Register/login test용",  # 기능 설명
        manual_parameters=[openapi.Parameter('user', openapi.IN_QUERY, description="username", type=openapi.TYPE_STRING)]  # 인자 형식
    )
    def get(self, request):
        try:
            user = User.objects.get(username=request.query_params.get('user'))
            return Response({"user:" + user.username})
        except User.DoesNotExist:
            return Response("No such user:")
