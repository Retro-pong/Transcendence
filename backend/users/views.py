from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfileSerializer


class ProfileView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        tags=["users"],  # Api 이름
        operation_description="사용자 프로필 api",  # 기능 설명
        responses={200: "OK", 401: "UNAUTHORIZED", 403: "FORBIDDEN"},  # 할당된 요청
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="JWT token",
                type=openapi.TYPE_STRING,
            )
        ],
    )
    def get(self, request):
        user = request.user
        serializer = ProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileEditView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        tags=["users"],  # Api 이름
        operation_description="사용자 프로필 수정",  # 기능 설명
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING),
                "comment": openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        responses={
            200: "OK",
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
        },  # 할당된 요청
    )
    def patch(self, request):
        user = request.user
        try:
            user.username = request.data["username"]
            user.comment = request.data["comment"]
            user.save()
        except KeyError:
            return Response(
                {"error": "Username and comment are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except:
            return Response(
                {"error": "Invalid username."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"message": "Profile edited."}, status=status.HTTP_200_OK)


class ProfileUploadView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        tags=["users"],  # Api 이름
        operation_description="사용자 프로필 업로드",  # 기능 설명
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "image": openapi.Schema(
                    type=openapi.TYPE_STRING, format=openapi.FORMAT_BINARY
                )
            },
        ),
        responses={
            200: "OK",
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
        },  # 할당된 요청
    )
    def patch(self, request):
        user = request.user
        image_file = request.data.get("image")
        if not image_file:
            return Response(
                {"error": "Image file is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        user.image = image_file
        user.save()
        return Response(
            {"message": "Profile image updated."}, status=status.HTTP_200_OK
        )
