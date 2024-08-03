from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import JsonResponse
from .serializers import RegisterSerializer
from users.models import User
from .utils import send_verification_code, verify_email, obtain_jwt_token
from django.shortcuts import redirect
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
import requests


class IntraLoginView(APIView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="intra 로그인",
        responses={200: "OK"},
    )
    def get(self, request):
        authorize_api_url = settings.INTRA_AUTHORIZE_API_URL
        client_id = settings.INTRA_CLIENT_ID
        redirect_uri = settings.INTRA_REDIRECT_URI
        url = f"{authorize_api_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
        return redirect(url)


class IntraCallbackView(APIView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="intra 콜백",
        responses={200: "OK", 400: "BAD_REQUEST", 502: "BAD_GATEWAY"},
    )
    def get(self, request):
        # 42 intra authorizes the user
        try:
            code = request.GET.get("code")
            intra_token = self.get_intra_token(code)
            intra_userinfo = self.get_intra_userinfo(intra_token)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        # Get user info from 42 intra and authenticate
        try:
            intra_id = intra_userinfo["login"]
            email = intra_userinfo["email"]
            user = User.objects.get(email=email)
        # 회원가입
        except User.DoesNotExist:
            username = intra_id
            while User.objects.filter(username=username).exists():
                username = User.objects.make_random_password(length=10).lower()
            user = User.objects.create_user(
                username=username, email=email, password="subinlee"  # Eastern egg!!
            )
            user.is_registered = True
        except:
            return Response(
                {"error": "Failed to get user info from 42 intra."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        # 로그인
        token = obtain_jwt_token(user)
        return token

    def get_intra_token(self, code) -> dict:
        """
        Get access token from 42 intra.
        """
        if not code:
            raise Exception("Failed to get code from 42 intra.")
        data = {
            "grant_type": "authorization_code",
            "client_id": settings.INTRA_CLIENT_ID,
            "client_secret": settings.INTRA_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.INTRA_REDIRECT_URI,
        }
        try:
            response = requests.post(settings.INTRA_TOKEN_API_URL, data=data)
            response_data = response.json()
            token = response_data["access_token"]
        except:
            raise Exception("Failed to get access token from 42 intra.")
        return response_data

    def get_intra_userinfo(self, intra_token) -> dict:
        """
        Get userinfo from 42 intra.
        """
        token_type = intra_token.get("token_type")
        access_token = intra_token.get("access_token")

        headers = {"Authorization": f"{token_type} {access_token}"}
        try:
            response = requests.get(settings.INTRA_USERINFO_API_URL, headers=headers)
            intra_userinfo = response.json()
        except:
            raise Exception("Failed to get user info from 42 intra.")
        return intra_userinfo


class EmailLoginView(APIView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="email 로그인",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="Email"),
                "password": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Password"
                ),
            },
        ),
        responses={200: "OK", 400: "BAD REQUEST", 500: "INTERNAL_SERVER_ERROR"},
    )
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")
            user = User.objects.get(email=email)
            if user.is_registered and user.check_password(password):
                # 2Factor Authentication
                if send_verification_code(email):
                    return Response(
                        {"message": "Verification code sent."},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"error": "Failed to send verification code."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        except:
            pass
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class EmailLoginVerifyView(APIView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="email 인증",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="Email"),
                "code": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Verification code"
                ),
            },
        ),
        responses={200: "OK", 401: "UNAUTHORIZED"},
    )
    def post(self, request):
        email = verify_email(request)
        if email is str():
            return Response(
                {"error": "Email verification failed."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        user = User.objects.get(email=email)
        token = obtain_jwt_token(user)
        return token


class EmailRegisterView(APIView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="email 회원가입",
        request_body=RegisterSerializer,
        responses={201: "CREATED", 400: "BAD_REQUEST", 500: "INTERNAL_SERVER_ERROR"},
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            email = serializer.validated_data["email"]
            if send_verification_code(email):
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                User.objects.filter(email=email).delete()
                return Response(
                    {"error": "Failed to send verification code."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            errors = serializer.errors
            return JsonResponse(errors, status=status.HTTP_400_BAD_REQUEST)


class EmailRegisterVerifyView(APIView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="email 인증",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="Email"),
                "code": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Verification code"
                ),
            },
        ),
        responses={200: "OK", 401: "UNAUTHORIZED"},
    )
    def post(self, request):
        email = verify_email(request)
        if email is str():
            return Response(
                {"error": "Email verification failed."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        User.objects.filter(email=email).update(is_registered=True)
        return Response(
            {"message": "Registration successful."}, status=status.HTTP_200_OK
        )


class LogoutView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        tags=["login"],
        operation_description="로그아웃",
        responses={200: "OK", 401: "UNAUTHORIZED"},
    )
    def post(self, request):
        response = Response(
            {"message": "Logout successful."}, status=status.HTTP_200_OK
        )
        response.delete_cookie("refresh_token")
        return response


class MyTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="body 없이 refresh token만 쿠키로 요청 받음",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={},
        ),
        responses={
            200: "OK",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            502: "BAD_GATEWAY",
        },
    )
    def post(self, request, *args, **kwargs) -> Response:
        # Get refresh token from cookie
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            response = Response(
                {"error": "No refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            response.delete_cookie("refresh_token")
            return response
        request.data["refresh"] = refresh_token

        # Refresh JWT tokens
        try:
            super().post(request, *args, **kwargs)
        except:
            response = Response(
                {"error": "Failed to refresh token."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
            response.delete_cookie("refresh_token")
            return response

        new_token = RefreshToken(request.data.get("refresh"))
        access_token = str(new_token.access_token)
        payload = new_token.payload
        email = payload["email"]

        try:
            user = User.objects.get(email=email)
        except:
            response = Response(
                {"error": "User does not exist."},
                status=status.HTTP_403_FORBIDDEN,
            )
            response.delete_cookie("refresh_token")
            return response

        # Activate the user
        user.is_active = True
        user.save()
        return Response(
            {
                "message": "Token refreshed",
                "access_token": access_token,
            },
            status=status.HTTP_200_OK,
        )
