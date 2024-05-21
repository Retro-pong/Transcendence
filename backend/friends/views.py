from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination
from .models import Friend
from .serializers import FriendSerializer

class FriendsListPagination(LimitOffsetPagination):
    default_limit = 6  # 기본 한 페이지에 6개 항목
    max_limit = 10  # 최대 한 페이지에 10개 항목

class FriendsListAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = FriendsListPagination

    @swagger_auto_schema(
        operation_description="Get a list of friends",
        responses={
            200: openapi.Response(
                description="Successful response",
            ),
            400: openapi.Response(
                description="Bad request",
            )
        }
    )
    def get(self, request): #친구 리스트 불러오기
        try:
            user = request.user
            friends = Friend.objects.filter(user=user)
            total = friends.count()
            paginator = self.pagination_class()
            paginated_friends = paginator.paginate_queryset(friends, request, view=self)
            serializer = FriendSerializer(paginated_friends, many=True)
            response_data = {
                'total': total,
                'friends': serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a friend",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'friend_name': openapi.Schema(type=openapi.TYPE_STRING, description='Name of the friend to delete')
            },
            required=['friend_name']
        ),
        responses={
            200: openapi.Response(
                description="Friend successfully deleted",
            ),
            400: openapi.Response(
                description="Bad request",
            )
        }
    )
    def patch(self, request): #친구 삭제
        try:
            user = request.user
            Friend.delete_friend(user, request.data['friend_name'])
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class WaitingListAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        return Response({'waiting_list': []})
    #def patch(self, request):

class AddListAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        return Response({'adding_list': []})
    #def patch(self, request):