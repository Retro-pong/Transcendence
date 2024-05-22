from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination
from users.models import User
from .models import Friend, FriendRequest
from .serializers import FriendSerializer, FriendRequestSerializer, UsernameSerializer


class FriendsListPagination(LimitOffsetPagination):
    default_limit = 6  # 기본 한 페이지에 6개 항목
    max_limit = 10  # 최대 한 페이지에 10개 항목


class FriendsListAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = LimitOffsetPagination

    @swagger_auto_schema(
        operation_description="Get the list of friends with pagination",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="JWT token",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "limit",
                openapi.IN_QUERY,
                description="Number of results to return per page.",
                type=openapi.TYPE_INTEGER,
            ),
            openapi.Parameter(
                "offset",
                openapi.IN_QUERY,
                description="The initial index from which to return the results.",
                type=openapi.TYPE_INTEGER,
            ),
        ],
        responses={
            200: openapi.Response(
                description="List of friends with total count",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "total": openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description="Total number of friends",
                        ),
                        "friends": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "friend_user": openapi.Schema(
                                        type=openapi.TYPE_INTEGER,
                                        description="ID of the friend user",
                                    ),
                                    "friend_info": openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            "username": openapi.Schema(
                                                type=openapi.TYPE_STRING,
                                                description="Username of the friend",
                                            ),
                                            "email": openapi.Schema(
                                                type=openapi.TYPE_STRING,
                                                description="Email of the friend",
                                            ),
                                            "image": openapi.Schema(
                                                type=openapi.TYPE_STRING,
                                                description="Image URL of the friend",
                                            ),
                                            "win": openapi.Schema(
                                                type=openapi.TYPE_INTEGER,
                                                description="Number of wins",
                                            ),
                                            "lose": openapi.Schema(
                                                type=openapi.TYPE_INTEGER,
                                                description="Number of losses",
                                            ),
                                            "comment": openapi.Schema(
                                                type=openapi.TYPE_STRING,
                                                description="Comment",
                                            ),
                                            "is_active": openapi.Schema(
                                                type=openapi.TYPE_BOOLEAN,
                                                description="Active status",
                                            ),
                                        },
                                    ),
                                },
                            ),
                        ),
                    },
                ),
            ),
            400: openapi.Response(
                description="Bad request",
                examples={"application/json": {"error": "Error message"}},
            ),
        },
    )
    def get(self, request):  # 친구 리스트 불러오기
        try:
            user = request.user
            friends = Friend.objects.filter(user=user)
            total = friends.count()
            paginator = self.pagination_class()
            paginated_friends = paginator.paginate_queryset(friends, request, view=self)
            serializer = FriendSerializer(paginated_friends, many=True)
            response_data = {"total": total, "friends": serializer.data}
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a friend",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="JWT token",
                type=openapi.TYPE_STRING,
            ),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "friend_name": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Name of the friend to delete"
                )
            },
            required=["friend_name"],
        ),
        responses={
            200: openapi.Response(
                description="Friend successfully deleted",
            ),
            400: openapi.Response(
                description="Bad request",
            ),
        },
    )
    def patch(self, request):  # 친구 삭제
        try:
            user = request.user
            Friend.delete_friend(user, request.data["friend_name"])
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class WaitingListAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get the list of friend requests",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="JWT token",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Successful response",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "friend_name": openapi.Schema(
                                type=openapi.TYPE_STRING, description="Friend name"
                            )
                        },
                    ),
                ),
            ),
            400: openapi.Response(
                description="Bad request",
                examples={"application/json": {"error": "Error message"}},
            ),
        },
    )
    def get(self, request):
        try:
            user = request.user
            friend_requests = FriendRequest.objects.filter(user=user)
            serializer = FriendRequestSerializer(friend_requests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Process a friend request",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="JWT token",
                type=openapi.TYPE_STRING,
            ),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "friend_name": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Name of the friend"
                ),
                "request_patch": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Friend request action (1 for accept, 0 for reject)",
                ),
            },
            required=["friend_name", "request_patch"],
        ),
        responses={
            200: openapi.Response(description="Request processed successfully"),
            400: openapi.Response(
                description="Bad request",
            ),
        },
    )
    def patch(self, request):
        user = request.user
        friend_name = request.data["friend_name"]
        request_patch = request.data["request_patch"]  # 친구 수락 1, 친구 거부 0
        if not friend_name or not request_patch:
            return Response(
                {"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
            )
        friend_request = FriendRequest.objects.get(user=user, friend_name=friend_name)
        if not friend_request:
            return Response(
                {"error": "Request does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )
        FriendRequest.delete_request(user=user, friend_name=friend_name)
        if request_patch:
            Friend.create_friend(user, friend_name)
        return Response(status=status.HTTP_200_OK)


class AddListAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get users whose username contains the search_name",
        manual_parameters=[
            openapi.Parameter(
                "search_name",
                openapi.IN_QUERY,
                description="Part of the username to search for",
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="JWT token",
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Successful response",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "username": openapi.Schema(
                                type=openapi.TYPE_STRING, description="Username"
                            )
                        },
                    ),
                ),
            ),
            400: openapi.Response(
                description="Bad request",
                examples={"application/json": {"error": "Error message"}},
            ),
        },
    )
    def get(self, request):  # search_name을 포함하는 모든 user 반환
        try:
            user = request.user
            search_name = request.query_params.get("search_name")
            users = User.objects.filter(username__icontains=search_name)
            serializer = UsernameSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Send a friend request",
        manual_parameters=[
            openapi.Parameter(
                "Authorization",
                openapi.IN_HEADER,
                description="JWT token",
                type=openapi.TYPE_STRING,
            ),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "friend_name": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Username of the friend to send request",
                )
            },
            required=["friend_name"],
        ),
        responses={
            200: openapi.Response(description="Friend request sent successfully"),
            400: openapi.Response(
                description="Bad request",
            ),
        },
    )
    def patch(self, request):
        user = request.user
        friend_name = request.data["friend_name"]
        if not friend_name:
            return Response(
                {"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
            )
        send_user = User.objects.get(username=friend_name)
        if not send_user:
            return Response(
                {"error": "User with friend name does not exist"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        FriendRequest.create_request(user=send_user, friend_name=user.username)
        return Response(status=status.HTTP_200_OK)
