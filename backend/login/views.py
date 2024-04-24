from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import render
from user.models import User


class IntraView(APIView):
    def get(self, request):
        return Response("email")
class EmailView(APIView):
    def get(self, request):
        try:
            #User.object.get("email"=email)
            response = render("target url")
            auth_token = make_jwt_token() #TODO : 토큰 만드는 메소드
            response.set_cookie("intra?", auth_token)
            return response

        except User.DoesNotExist:


        return Response("email")

def make_jwt_token() :
# Create your views here.


class TestView(APIView):
    @swagger_auto_schema(
        operation_description="test_description",
        operation_summary="test sum",
        operation_id="test id",
        tags=["test"],
    )
    def get(self, request):
        return Response("hello world")
