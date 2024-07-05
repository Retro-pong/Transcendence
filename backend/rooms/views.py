from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Room
from .serializers import RoomSerializer


class JoinNormalRoomAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get the list of tournament rooms",
        responses={
            200: openapi.Response(
                description="List of tournament rooms",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "id": openapi.Schema(
                                type=openapi.TYPE_INTEGER, description="Room ID"
                            ),
                            "room_name": openapi.Schema(
                                type=openapi.TYPE_STRING, description="Room name"
                            ),
                            "game_mode": openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description="Game mode(normal)",
                            ),
                            "game_map": openapi.Schema(
                                type=openapi.TYPE_STRING, description="Game map"
                            ),
                            "game_speed": openapi.Schema(
                                type=openapi.TYPE_INTEGER, description="Game speed"
                            ),
                            "current_players": openapi.Schema(
                                type=openapi.TYPE_INTEGER,
                                description="Current number of players",
                            ),
                            "game_ball": openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description="ball color in game",
                            ),
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
            rooms = Room.objects.filter(game_mode="normal")
            serializer = RoomSerializer(rooms, many=True)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)


class JoinTournamentRoomAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get the list of tournament rooms",
        responses={
            200: openapi.Response(
                description="List of tournament rooms",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "id": openapi.Schema(
                                type=openapi.TYPE_INTEGER, description="Room ID"
                            ),
                            "room_name": openapi.Schema(
                                type=openapi.TYPE_STRING, description="Room name"
                            ),
                            "game_mode": openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description="Game mode(tournament)",
                            ),
                            "game_map": openapi.Schema(
                                type=openapi.TYPE_STRING, description="Game map"
                            ),
                            "game_speed": openapi.Schema(
                                type=openapi.TYPE_INTEGER, description="Game speed"
                            ),
                            "current_players": openapi.Schema(
                                type=openapi.TYPE_INTEGER,
                                description="Current number of players",
                            ),
                            "game_ball": openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description="ball color in game",
                            ),
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
            ),
            403: openapi.Response(
                description="Forbidden",
            ),
        },
    )
    def get(self, request):
        try:
            rooms = Room.objects.filter(game_mode="tournament")
            serializer = RoomSerializer(rooms, many=True)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateRoomAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Create a new room",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "room_name": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Name of the room"
                ),
                "game_mode": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Game mode of the room"
                ),
                "game_speed": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Game speed of the room"
                ),
                "game_map": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Game map of the room"
                ),
                "game_ball": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="ball color in game",
                ),
            },
            required=[
                "room_name",
                "game_mode",
                "game_speed",
                "game_map",
                "game_ball",
            ],
        ),
        responses={
            200: openapi.Response(description="Room created successfully"),
            400: openapi.Response(
                description="Bad request",
            ),
            401: openapi.Response(
                description="Unauthorized",
            ),
            403: openapi.Response(
                description="Forbidden",
            ),
        },
    )
    def post(self, request):
        try:
            room_name = request.data["room_name"]
            game_mode = request.data["game_mode"]
            game_speed = request.data["game_speed"]
            game_map = request.data["game_map"]
            game_ball = request.data["game_ball"]
            room = Room.create_room(
                room_name, game_mode, game_map, game_speed, game_ball
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"id": room.id}, status=status.HTTP_200_OK)
