from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import render


class IntraView(APIView):
    def get(self, request):
        return Response("intra")


class EmailLoginView(APIView):
    def post(self, request):
        return Response("email")


class EmailRegisterView(APIView):
    def post(self, request):
        return Response("register")


class TestView(APIView):
    @swagger_auto_schema(
        tags=["login"],  # Api 이름
        operation_description="",  # 기능 설명
        manual_parameters=[],  # 인자 형식
        responses={400: "BAD_REQUEST"},  # 할당된 요청
    )
    def get(self, request):
        return Response("hello world")
