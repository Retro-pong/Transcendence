from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User
from game.models import GameResult
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
import os


class ProfileAPITestCase(APITestCase):
    def setUp(self):
        # 사용자 생성 및 JWT 토큰 발급
        self.user = User.objects.create_user(
            username="testuser", email="testuser@example.com", password="testpassword"
        )
        self.user1 = User.objects.create_user(
            username="testuser1", email="testuser1@example.com", password="testpassword"
        )
        self.user.win = 10
        self.user.lose = 10
        self.user.comment = "Hello world"
        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()

        GameResult.objects.create(
            winner=self.user,
            player1=self.user1,
            player2=self.user,
            start_time=timezone.now(),
        )
        GameResult.objects.create(
            winner=self.user,
            player1=self.user,
            player2=self.user1,
            start_time=timezone.now(),
        )
        GameResult.objects.create(
            winner=self.user1,
            player1=self.user,
            player2=self.user1,
            start_time=timezone.now(),
        )

        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.cookies["refresh_token"] = refresh_token
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

    def test_get_profile(self):
        url = reverse("users:profile")  # ProfileView URL 설정
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["email"], self.user.email)
        expected_image_path = os.path.abspath("/media/images/default_image.jpeg")
        self.assertEqual(response.data["image"], expected_image_path)
        self.assertEqual(response.data["win"], self.user.win)
        self.assertEqual(response.data["lose"], self.user.lose)
        self.assertEqual(response.data["comment"], self.user.comment)

    def test_battle_history(self):
        url = reverse("users:profile")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["history"]), 3)
        self.assertEqual(response.data["history"][0]["winner_username"], "testuser")
        self.assertEqual(response.data["history"][1]["player2_username"], "testuser1")

    def test_edit_profile(self):
        url = reverse("users:profile_edit")  # ProfileEditView URL 설정
        data = {"username": "new username", "comment": "new comment"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, data["username"])
        self.assertEqual(self.user.comment, data["comment"])

    def test_upload_profile_image(self):
        url = reverse("users:profile_upload")  # ProfileUploadView URL 설정
        if os.path.exists("./media/images/test_image.jpg"):
            os.remove("./media/images/test_image.jpg")
        with open("./media/test/test_image.jpg", "rb") as image_file:
            response = self.client.patch(url, {"image": image_file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.image)
        if os.path.exists("./media/images/test_image.jpg"):
            os.remove("./media/images/test_image.jpg")

    def test_edit_profile_missing_data(self):
        url = reverse("users:profile_edit")  # ProfileEditView URL 설정
        data = {}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_profile_image_missing_data(self):
        url = reverse("users:profile_upload")  # ProfileUploadView URL 설정
        response = self.client.patch(url, {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_profile_unauthorized(self):
        self.client.credentials()  # 토큰 제거
        url = reverse("users:profile")  # ProfileView URL 설정
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_profile_unauthorized(self):
        self.client.credentials()  # 토큰 제거
        url = reverse("users:profile_edit")  # ProfileEditView URL 설정
        data = {"username": "new username", "comment": "new comment"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_upload_profile_image_unauthorized(self):
        self.client.credentials()  # 토큰 제거
        url = reverse("users:profile_upload")  # ProfileUploadView URL 설정
        with open("./media/test/test_image.jpg", "rb") as image_file:
            response = self.client.patch(url, {"image": image_file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
