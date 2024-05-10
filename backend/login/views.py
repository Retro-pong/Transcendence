from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import JsonResponse
from .serializers import RegisterSerializer
from .models import TFA
from users.models import User
from .utils import send_verification_code, obtain_jwt_token
from django.shortcuts import redirect
from django.conf import settings
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
            response_data = self.get_intra_token(code)
        except Exception as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)

        token_type = response_data.get("token_type")
        access_token = response_data.get("access_token")
        try:
            email = self.get_email(access_token)
            user = User.objects.get(email=email)
            # TODO: user 로그인
        except User.DoesNotExist:
            # TODO: user 새로 생성
            pass
        except Exception as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)

        # 사용자 정보 요청
        headers = {"Authorization": f"{token_type} {access_token}"}
        response = requests.get(settings.INTRA_USERINFO_API_URL, headers=headers)
        response_data = response.json()
        try:
            intra_id = response_data["login"]
            email = response_data["email"]
            image = response_data["image"]["link"]
        except:
            return Response(
                {"error": "Failed to get user information."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 사용자 정보로 회원가입
        user = User.objects.filter(email=email).first()
        if not user:
            user = User.objects.create_user(username=intra_id, email=email)
        user.is_registered = True
        user.is_authenticated = True
        user.image = image
        user.save()

        # jwt 토큰을 담은 response 반환 (status code: 200)
        return obtain_jwt_token(user)

    def get_intra_token(self, code) -> dict:
        data = {
            "grant_type": "authorization_code",
            "client_id": settings.INTRA_CLIENT_ID,
            "client_secret": settings.INTRA_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.INTRA_REDIRECT_URI,  # TODO: check
        }
        response = requests.post(settings.INTRA_TOKEN_API_URL, data=data)
        if not response.status_code == 200:
            raise Exception("Failed to get access token.")
        response_data = response.json()
        return response_data

    def get_email(self, access_token) -> str:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(settings.INTRA_USERINFO_API_URL, headers=headers)
        if not response.status_code == 200:
            raise Exception("Failed to get email.")
        response_data = response.json()
        email = response_data["email"]
        if email is None:
            raise Exception("Failed to get email.")
        return email


class EmailLogoutView(APIView):  # TODO delete (for test)
    @swagger_auto_schema(
        tags=["login"],
        operation_description="email 로그아웃",
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
            user.save()
            # jwt 토큰을 담은 response 반환 (status code: 200)
            return obtain_jwt_token(user)

        # Got the wrong verification code
        else:
            return Response(
                {"error": "Email verification failed."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


# class RefreshTokenView(APIView):
#     @swagger_auto_schema(
#         tags=["login"],
#         operation_description="refresh token",
#         request_body=openapi.Schema(
#             type=openapi.TYPE_OBJECT,
#             properties={
#                 "email": openapi.Schema(type=openapi.TYPE_STRING, description="Email"),
#                 "refresh_token": openapi.Schema(
#                     type=openapi.TYPE_STRING, description="Refresh token"
#                 ),
#             },
#         ),
#         responses={200: "OK", 401: "UNAUTHORIZED"},
#     )
#     def post(self, request):
#         email = request.data.get("email")
#         refresh_token = request.data.get("refresh_token")
#         user = User.objects.get(email=email)
#         jwt = JWT.objects.filter(user=user).first()
#
#         # Got the correct refresh token
#         if jwt and jwt.refresh_token == refresh_token:
#             return obtain_jwt_token(user)
#
#         # Got the wrong refresh token
#         else:
#             return Response(
#                 {"error": "Invalid refresh token."},
#                 status=status.HTTP_401_UNAUTHORIZED,
#             )


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
