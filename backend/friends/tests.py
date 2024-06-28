from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User
from .models import Friend, FriendRequest
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class FriendsListAPIViewTestCase(APITestCase):
    def setUp(self):
        # 사용자 생성 및 JWT 토큰 발급
        self.user = User.objects.create_user(
            username="testuser", email="testuser@example.com", password="testpassword"
        )
        self.user2 = User.objects.create_user(
            username="friend1", email="friend1@example.com", password="testpassword"
        )
        self.user3 = User.objects.create_user(
            username="friend2", email="friend2@example.com", password="testpassword"
        )
        self.user4 = User.objects.create_user(
            username="friend3", email="friend3@example.com", password="testpassword"
        )
        self.user5 = User.objects.create_user(
            username="friend4", email="friend4@example.com", password="testpassword"
        )

        # Friend 관계 설정
        Friend.create_friend(self.user, self.user2)
        Friend.create_friend(self.user, self.user3)
        Friend.create_friend(self.user4, self.user)

        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()
        # JWT 토큰 설정
        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

    def test_get_friends_list(self):
        url = reverse("friends:friend_list")  # FriendsListAPIView URL 설정
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 1)
        self.assertEqual(
            response.data["friends"][0]["friend_info"]["username"], "friend1"
        )
        self.assertEqual(
            response.data["friends"][1]["friend_info"]["username"], "friend2"
        )
        self.assertEqual(
            response.data["friends"][2]["friend_info"]["username"], "friend3"
        )

    def test_pagination_friends_list(self):
        # 더 많은 친구 생성
        for i in range(3, 21):
            friend_user = User.objects.create_user(
                username=f"test{i}",
                email=f"test{i}@example.com",
                password="testpassword",
            )
            Friend.objects.create(user=self.user, friend_user=friend_user)

        url = reverse("friends:friend_list")  # FriendsListAPIView URL 설정
        response = self.client.get(url, {"limit": 5, "offset": 0})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["friends"]), 5)

        response = self.client.get(url, {"limit": 3, "offset": 5})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["friends"]), 3)

    def test_friend_delete(self):
        url = reverse("friends:friend_list")
        response = self.client.patch(url, {"friend_name": "friend1"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url)
        self.assertEqual(
            response.data["friends"][0]["friend_info"]["username"], "friend2"
        )

    def test_get_friend_requests(self):
        FriendRequest.objects.create(user=self.user, friend_user=self.user2)
        FriendRequest.objects.create(user=self.user, friend_user=self.user3)

        url = reverse("friends:waiting_list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_process_friend_request(self):
        friend_request = FriendRequest.objects.create(
            user=self.user, friend_user=self.user5
        )

        url = reverse("friends:waiting_list")
        data = {"friend_name": "friend4", "request_patch": 1}
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(FriendRequest.objects.filter(id=friend_request.id).exists())

    def test_friend_request_duplicate(self):
        friend_request1 = FriendRequest.objects.create(
            user=self.user, friend_user=self.user2
        )
        url = reverse("friends:waiting_list")
        data = {"friend_name": "friend1", "request_patch": 1}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)


class AddListAPIViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )
        self.user1 = User.objects.create_user(
            username="user1", email="test1@example.com", password="testpassword"
        )
        self.user2 = User.objects.create_user(
            username="user2", email="test2@example.com", password="testpassword"
        )
        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()

        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

    def test_get_users_with_search_name(self):
        url = reverse("friends:add_list")
        response = self.client.get(url, {"search_name": "user"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_send_friend_request(self):
        url = reverse("friends:add_list")
        data = {"friend_name": "user2"}
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        send_user = User.objects.get(username="user2")
        self.assertTrue(
            FriendRequest.objects.filter(user=send_user, friend_user=self.user).exists()
        )

    def test_send_friend_request_again(self):
        url = reverse("friends:add_list")
        data = {"friend_name": "user1"}
        FriendRequest.create_request(user=self.user1, friend_name=self.user.username)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_send_friend_request_already_exists(self):
        url = reverse("friends:add_list")
        data = {"friend_name": "user1"}
        Friend.create_friend(
            user=User.objects.get(username="user1"), friend_name=self.user
        )
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_send_myself(self):
        url = reverse("friends:add_list")
        data = {"friend_name": "testuser"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
