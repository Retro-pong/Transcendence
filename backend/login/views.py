from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import JsonResponse
from .serializers import RegisterSerializer
from .models import TFA
from users.models import User
from .utils import send_verification_code, obtain_jwt_token
from django.shortcuts import redirect
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
        responses={200: "OK", 400: "BAD_REQUEST", 500: "INTERNAL_SERVER_ERROR"},
    )
    def get(self, request):
        try:
            code = request.GET.get("code")
            intra_token = self.get_intra_token(code)
            intra_userinfo = self.get_intra_userinfo(intra_token)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        intra_id = intra_userinfo["login"]
        email = intra_userinfo["email"]
        image = intra_userinfo["image"]["link"]

        try:
            user = User.objects.get(email=email)
            # 로그인 전적이 있는 경우, 이미 접속 중인지 확인
            if user.is_authenticated:
                return Response(
                    {"error": "Already logged in."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except User.DoesNotExist:
            # 로그인 전적이 없는 경우, 회원가입
            username = intra_id
            while User.objects.filter(username=username).exists():
                username = User.objects.make_random_password(length=10)
            user = User.objects.create_user(
                username=username, email=email, password="subinlee"  # TODO: check
            )

        # 로그인 및 JWT 반환
        user.is_registered = True
        user.is_authenticated = True
        user.is_active = True
        user.image = image
        user.save()

        # JWT 토큰 발급 및 redirect 반환
        token = TokenObtainPairSerializer.get_token(user)
        response = redirect(settings.BASE_URL)
        response.set_cookie("refresh_token", str(token), httponly=True, secure=True)
        return response

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
        except:
            raise Exception("Failed to get access token from 42 intra.")
        try:
            response_data["access_token"]
        except KeyError:
            raise Exception(response_data.get("error_description"))

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
            raise Exception("Failed to get userinfo from 42 intra.")
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
        responses={200: "OK", 401: "UNAUTHORIZED", 500: "INTERNAL_SERVER_ERROR"},
    )
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # Authenticate the user
        try:
            user = User.objects.get(email=email)
            if user and user.is_registered:
                # 이미 로그인된 상태인 경우
                if user.is_authenticated:
                    return Response(
                        {"error": "Already logged in."},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                # 비밀번호 일치 여부 확인
                if user.check_password(password):
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
        # Login failed
        except Exception as e:
            pass
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED,
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
        email = request.data.get("email")
        code = request.data.get("code")
        tfa = TFA.objects.filter(email=email).first()

        # Got the correct verification code
        if tfa and tfa.code == code:
            # 해당 이메일에 대해 모든 발신 기록 삭제
            TFA.objects.filter(email=email).delete()
            user = User.objects.get(email=email)
            user.is_authenticated = True
            user.is_active = True
            user.save()
            # jwt 토큰을 담은 response 반환 (status code: 200)
            return obtain_jwt_token(user)

        # Got the wrong verification code
        else:
            return Response(
                {"error": "Email verification failed."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class EmailRegisterView(APIView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="email 회원가입",
        request_body=RegisterSerializer,
        responses={201: "CREATED", 400: "BAD_REQUEST"},
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # 이메일 인증
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
        email = request.data.get("email")
        code = request.data.get("code")
        tfa = TFA.objects.filter(email=email).first()

        # Got the correct verification code
        if tfa and tfa.code == code:
            # 해당 이메일에 대해 모든 발신 기록 삭제
            TFA.objects.filter(email=email).delete()
            User.objects.filter(email=email).update(is_registered=True)
            return Response("Email verification successful.", status=status.HTTP_200_OK)

        # Got the wrong verification code
        else:
            return Response(
                {"error": "Email verification failed."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class MyTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(
        tags=["login"],
        operation_description="body 없이 refresh token만 쿠키로 전송",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={},
        ),
        responses={200: "OK", 401: "UNAUTHORIZED"},
    )
    def post(self, request: Request, *args, **kwargs) -> Response:
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"error": "No refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        data = {"refresh": refresh_token}
        request._data = data
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return response
        else:
            user = request.user
            user.is_authenticated = False
            user.save()
            return Response(
                {"error": "Failed to refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutView(APIView):  # TODO delete (for test)
    @swagger_auto_schema(
        tags=["login"],
        operation_description="email 로그아웃 (테스트용 임시 API)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="Email")
            },
        ),
        responses={200: "OK", 401: "UNAUTHORIZED"},
    )
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            if user and user.is_authenticated:
                user.is_authenticated = False
                user.is_active = False
                user.save()
                return Response("Logout successful.", status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Already logged out."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except Exception as e:
            return Response(
                {"error": "Invalid email."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
