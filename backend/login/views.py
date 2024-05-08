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


class IntraView(APIView):
    def get(self, request):
        return Response("intra")


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
            if user and user.is_active:
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
            if user and user.is_authenticated:
                # 이미 로그인된 상태인 경우
                if user.is_active:
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
            User.objects.filter(email=email).update(is_authenticated=True)
            return Response("Email verification successful.", status=status.HTTP_200_OK)

        # Got the wrong verification code
        else:
            return Response(
                {"error": "Email verification failed."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
