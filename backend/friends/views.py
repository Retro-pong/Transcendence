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
import math


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
            401: openapi.Response(
                description="Unauthorized",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                },
            ),
            403: openapi.Response(
                description="Forbidden",
                examples={"application/json": {"error": "User not found."}},
            ),
        },
    )
    def get(self, request):
        """
        Get the list of friends with pagination
        """
        user = request.user
        friends = Friend.objects.filter(user=user)
        friends_num = friends.count()
        limit = int(request.query_params.get("limit", 10))  # default value: 10
        total = math.ceil(friends_num / limit)

        paginator = self.pagination_class()
        paginated_friends = paginator.paginate_queryset(friends, request, view=self)
        serializer = FriendSerializer(paginated_friends, many=True)
        response_data = {"total": total, "friends": serializer.data}
        return Response(response_data, status=status.HTTP_200_OK)

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
                description="Friend deletion successful.",
            ),
            400: openapi.Response(
                description="Bad request",
                examples={"application/json": {"error": "Friend name is required."}},
            ),
            401: openapi.Response(
                description="Unauthorized",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                },
            ),
            403: openapi.Response(
                description="Forbidden",
                examples={"application/json": {"error": "User not found."}},
            ),
            409: openapi.Response(
                description="Conflict",
                examples={
                    "application/json": {"error": "The user is not your friend."}
                },
            ),
        },
    )
    def patch(self, request):
        """
        Delete a friend
        """
        user = request.user
        try:
            friend_name = request.data["friend_name"]
            Friend.delete_friend(user, friend_name)
        except KeyError:
            return Response(
                {"error": "Friend name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"message": "Friend deletion successful."}, status=status.HTTP_200_OK
        )


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
            401: openapi.Response(
                description="Unauthorized",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                },
            ),
            403: openapi.Response(
                description="Forbidden",
                examples={"application/json": {"error": "User not found."}},
            ),
            500: openapi.Response(
                description="Internal server error",
            ),
        },
    )
    def get(self, request):
        """
        Get the list of friend requests
        """
        user = request.user
        friend_requests = FriendRequest.objects.filter(user=user)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
            401: openapi.Response(
                description="Unauthorized",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                },
            ),
            403: openapi.Response(
                description="Forbidden",
                examples={"application/json": {"error": "User not found."}},
            ),
            404: openapi.Response(
                description="Not found",
                examples={"application/json": {"error": "Friend request not found."}},
            ),
            409: openapi.Response(
                description="Conflict",
                examples={
                    "application/json": {"error": "The user is already your friend."}
                },
            ),
        },
    )
    def patch(self, request):
        """
        Process a friend request
        """
        user = request.user
        try:
            friend_name = request.data["friend_name"]
            request_accepted = int(request.data["request_patch"])  # 1 수락, 0 거절
            FriendRequest.delete_request(user=user, friend_name=friend_name)
        except KeyError:
            return Response(
                {"error": "Friend name and request patch are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if request_accepted:  # 친구 요청 수락 처리
            try:
                Friend.create_friend(user, friend_name)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_409_CONFLICT)
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_200_OK)  # 친구 요청 거절 처리


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
            401: openapi.Response(
                description="Unauthorized",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                },
            ),
        },
    )
    def get(self, request):
        """
        Get users whose username contains the search_name
        """
        search_name = request.query_params.get("search_name")
        if not search_name:
            return Response(
                {"error": "Name is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        users = User.objects.filter(username__icontains=search_name)
        serializer = UsernameSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
            200: openapi.Response(description="OK"),
            201: openapi.Response(description="Friend request sent successfully"),
            400: openapi.Response(
                description="Bad request",
            ),
            401: openapi.Response(
                description="Unauthorized",
                examples={
                    "application/json": {
                        "detail": "Authentication credentials were not provided."
                    }
                },
            ),
            403: openapi.Response(
                description="Forbidden",
                examples={"application/json": {"error": "User not found."}},
            ),
            404: openapi.Response(
                description="Not found",
                examples={"application/json": {"error": "Friend not found."}},
            ),
        },
    )
    def patch(self, request):
        """
        Send a friend request
        """
        # 신청을 보내는 유저 유효성 검사
        user = request.user
        try:
            friend_name = request.data["friend_name"]
        except:
            return Response(
                {"error": "Friend name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 신청을 받는 유저 유효성 검사
        try:
            send_user = User.objects.get(username=friend_name)
        except:
            return Response(
                {"error": "Friend not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if send_user == request.user:
            return Response(
                {"error": "You can't be a friend with yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # 대상과 이미 친구인지 확인
            Friend.objects.get(user=user, friend_user=send_user)
            return Response(
                {"error": "The user is already your friend."},
                status=status.HTTP_200_OK,
            )
        except:  # Friend.DoesNotExist
            try:
                FriendRequest.objects.get(user=send_user, friend_user=user)
                # 이미 친구 신청을 보낸 대상인지 확인
                return Response(
                    {"error": "Friend request already sent."}, status=status.HTTP_200_OK
                )
            # 친구 신청 성공
            except:  # FriendRequest.DoesNotExist
                FriendRequest.create_request(user=send_user, friend_name=user.username)
                return Response(status=status.HTTP_201_CREATED)
