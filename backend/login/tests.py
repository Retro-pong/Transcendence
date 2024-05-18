from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import TFA

User = get_user_model()


class IntraLoginViewTests(APITestCase):
    def test_intra_login_redirect(self):
        response = self.client.get(reverse("intra-login"))
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)


class IntraCallbackViewTests(APITestCase):
    @patch("your_app.views.IntraCallbackView.get_intra_token")
    @patch("your_app.views.IntraCallbackView.get_intra_userinfo")
    def test_intra_callback_existing_user(
        self, mock_get_intra_userinfo, mock_get_intra_token
    ):
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass"
        )
        mock_get_intra_token.return_value = {"access_token": "mock_access_token"}
        mock_get_intra_userinfo.return_value = {
            "login": "testuser",
            "email": "test@example.com",
            "image": {"link": "test_image_link"},
        }

        response = self.client.get(reverse("intra-callback"), {"code": "mock_code"})
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

    @patch("your_app.views.IntraCallbackView.get_intra_token")
    @patch("your_app.views.IntraCallbackView.get_intra_userinfo")
    def test_intra_callback_new_user(
        self, mock_get_intra_userinfo, mock_get_intra_token
    ):
        mock_get_intra_token.return_value = {"access_token": "mock_access_token"}
        mock_get_intra_userinfo.return_value = {
            "login": "newuser",
            "email": "new@example.com",
            "image": {"link": "new_image_link"},
        }

        response = self.client.get(reverse("intra-callback"), {"code": "mock_code"})
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertTrue(User.objects.filter(email="new@example.com").exists())


class EmailLoginViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass"
        )
        self.user.is_registered = True
        self.user.save()

    @patch("your_app.utils.send_verification_code")
    def test_email_login_success(self, mock_send_verification_code):
        mock_send_verification_code.return_value = True
        data = {"email": "test@example.com", "password": "testpass"}
        response = self.client.post(reverse("email-login"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_email_login_fail(self):
        data = {"email": "test@example.com", "password": "wrongpass"}
        response = self.client.post(reverse("email-login"), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EmailLoginVerifyViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass"
        )
        TFA.objects.create(email="test@example.com", code="123456")

    def test_email_login_verify_success(self):
        data = {"email": "test@example.com", "code": "123456"}
        response = self.client.post(reverse("email-login-verify"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_email_login_verify_fail(self):
        data = {"email": "test@example.com", "code": "wrongcode"}
        response = self.client.post(reverse("email-login-verify"), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EmailRegisterViewTests(APITestCase):
    @patch("your_app.utils.send_verification_code")
    def test_email_register_success(self, mock_send_verification_code):
        mock_send_verification_code.return_value = True
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass",
            "password2": "newpass",
        }
        response = self.client.post(reverse("email-register"), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="new@example.com").exists())

    def test_email_register_fail(self):
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass",
            "password2": "mismatch",
        }
        response = self.client.post(reverse("email-register"), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EmailRegisterVerifyViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="newuser", email="new@example.com", password="newpass"
        )
        TFA.objects.create(email="new@example.com", code="123456")

    def test_email_register_verify_success(self):
        data = {"email": "new@example.com", "code": "123456"}
        response = self.client.post(reverse("email-register-verify"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            User.objects.filter(email="new@example.com", is_registered=True).exists()
        )

    def test_email_register_verify_fail(self):
        data = {"email": "new@example.com", "code": "wrongcode"}
        response = self.client.post(reverse("email-register-verify"), data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass"
        )
        self.client.force_authenticate(user=self.user)

    def test_logout(self):
        response = self.client.post(reverse("logout"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse("refresh_token" in response.cookies)


class MyTokenRefreshViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass"
        )
        self.token = TokenObtainPairSerializer.get_token(self.user)
        self.refresh_token = str(self.token)
        self.client.cookies["refresh_token"] = self.refresh_token

    def test_token_refresh_success(self):
        response = self.client.post(reverse("token-refresh"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)

    def test_token_refresh_fail(self):
        self.client.cookies["refresh_token"] = "invalidtoken"
        response = self.client.post(reverse("token-refresh"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
