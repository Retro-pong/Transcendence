from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch, MagicMock
from django.conf import settings
from users.models import User
from .models import TFA
from .utils import send_verification_code, verify_email, obtain_jwt_token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class LoginAPITestCase(APITestCase):

    def setUp(self):
        self.username = "subinlee"
        self.email = "ddubi701@gmail.com"
        self.password = "testpassword"
        self.user = User.objects.create_user(
            username=self.username, email=self.email, password=self.password
        )
        self.user.is_authenticated = True
        self.user.is_active = True
        self.user.save()
        self.verification_code = "123456"
        self.tfa = TFA.objects.create(email=self.email, code=self.verification_code)

    @patch("smtplib.SMTP")
    def test_send_verification_code(self, mock_smtp):
        instance = mock_smtp.return_value
        instance.sendmail.return_value = {}

        result = send_verification_code(self.email)
        self.assertTrue(result)
        tfa_entry = TFA.objects.filter(email=self.email).first()
        self.assertIsNotNone(tfa_entry)
        self.assertEqual(tfa_entry.email, self.email)
        instance.sendmail.assert_called_with(
            settings.EMAIL_HOST_USER,
            self.email,
            f"Your verification code is <{tfa_entry.code}>",
        )

    def test_verify_email_success(self):
        request = MagicMock()
        request.data = {"email": self.email, "code": self.verification_code}

        result = verify_email(request)
        self.assertEqual(result, self.email)
        self.assertFalse(TFA.objects.filter(email=self.email).exists())

    def test_verify_email_failure(self):
        request = MagicMock()
        request.data = {"email": self.email, "code": "wrongcode"}

        result = verify_email(request)
        self.assertEqual(result, "")
        self.assertTrue(TFA.objects.filter(email=self.email).exists())

    def test_obtain_jwt_token(self):
        response = obtain_jwt_token(self.user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertTrue(response.cookies.get("refresh_token"))

    def test_intra_login_view(self):
        response = self.client.get(reverse("login:intra_login"))
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn(settings.INTRA_AUTHORIZE_API_URL, response.url)

    @patch("requests.post")
    @patch("requests.get")
    def test_intra_callback_view(self, mock_get, mock_post):
        token_response = {"access_token": "dummy_token", "token_type": "Bearer"}
        user_info_response = {
            "login": "intrauser",
            "email": "intra@example.com",
            "image": {"link": "http://example.com/image.png"},
        }

        mock_post.return_value.json.return_value = token_response
        mock_get.return_value.json.return_value = user_info_response

        response = self.client.get(
            reverse("login:intra_callback"), {"code": "dummy_code"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)

    def test_email_login_view(self):
        self.user.is_registered = True
        self.user.save()
        data = {"email": self.email, "password": self.password}
        response = self.client.post(reverse("login:email_login"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("error", response.data)

    def test_email_login_verify_view(self):
        data = {"email": self.email, "code": self.verification_code}
        response = self.client.post(reverse("login:email_login_verify"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)

    def test_email_register_view(self):
        new_email = "new@example.com"
        data = {"email": new_email, "password": "newpassword", "username": "newuser"}
        response = self.client.post(reverse("login:email_register"), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_email_register_verify_view(self):
        new_email = "new@example.com"
        TFA.objects.create(email=new_email, code="654321")
        data = {"email": new_email, "code": "654321"}
        response = self.client.post(reverse("login:email_register_verify"), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, "Email verification successful.")

    def test_logout_view(self):
        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.cookies["refresh_token"] = refresh_token
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)

        response = self.client.post(reverse("login:logout"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.cookies["refresh_token"].value, "")

    def test_my_token_refresh_view(self):
        refresh_token = RefreshToken.for_user(self.user)
        self.client.cookies["refresh_token"] = str(refresh_token)
        response = self.client.post(reverse("login:token_refresh"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
