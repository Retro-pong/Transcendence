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

    def get(self, request):
        try:
            user = request.user
            friends = Friend.objects.filter(user=user)
            paginator = self.pagination_class()
            paginated_friends = paginator.paginate_queryset(friends, request, view=self)
            serializer = FriendSerializer(paginated_friends, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    #def patch(self, request):

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