from django.shortcuts import render
from django.http import JsonResponse
from users.models import User
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
# Create your views here.

class ProfileView(APIView):
    def get(self, request):
        return Response("user profile")

class ProfileEditView(APIView):
    def patch(self, request):
        return Response("user profile edit")

class ProfileUploadView(APIView):
    @swagger_auto_schema(
        tags=["users"],  # Api 이름
        operation_description="사용자 프로필 업로드",  # 기능 설명
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_BINARY)
            }
        ),
        responses={200: "OK", 400: "BAD_REQUEST"},  # 할당된 요청
    )
    def patch(self, request):
        username = request.data['username']
        image_file = request.data.get('image')
        if not image_file:
            return Response("Image file is required", status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
            user.image = image_file
            user.save()
            return Response("User profile updated")
        except User.DoesNotExist:
            return Response("User does not exist", status=status.HTTP_400_BAD_REQUEST)

