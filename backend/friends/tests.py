from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User
from .models import Friend
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class FriendsListAPIViewTestCase(APITestCase):
    def setUp(self):
        # 사용자 생성 및 JWT 토큰 발급
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')
        self.user2 = User.objects.create_user(username='friend1', email='friend1@example.com', password='testpassword')
        self.user3 = User.objects.create_user(username='friend2', email='friend2@example.com', password='testpassword')
        self.user4 = User.objects.create_user(username='friend3', email='friend3@example.com', password='testpassword')

        # Friend 관계 설정
        Friend.create_friend(self.user, self.user2)
        Friend.create_friend(self.user, self.user3)
        Friend.create_friend(self.user, self.user4)

        self.user.is_authenticated = True
        self.user.is_registered = True
        self.user.is_active = True
        self.user.save()
        # JWT 토큰 설정
        token = TokenObtainPairSerializer.get_token(self.user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)


    def test_get_friends_list(self):
        url = reverse('friends:friend_list')  # FriendsListAPIView URL 설정
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 3)
        self.assertEqual(response.data['friends'][0]['friend_info']['username'], 'friend1')
        self.assertEqual(response.data['friends'][1]['friend_info']['username'], 'friend2')
        self.assertEqual(response.data['friends'][2]['friend_info']['username'], 'friend3')

    def test_pagination_friends_list(self):
        # 더 많은 친구 생성
        for i in range(3, 21):
            friend_user = User.objects.create_user(username=f'test{i}', email=f'test{i}@example.com', password='testpassword')
            Friend.objects.create(user=self.user, friend_user=friend_user)

        url = reverse('friends:friend_list')  # FriendsListAPIView URL 설정
        response = self.client.get(url, {'limit': 5, 'offset': 0})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['friends']), 5)

        response = self.client.get(url, {'limit': 3, 'offset': 5})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['friends']), 3)

    def test_friend_delete(self):
        url = reverse('friends:friend_list')
        response = self.client.patch(url, {'friend_name': 'friend1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url)
        self.assertEqual(response.data['friends'][0]['friend_info']['username'], 'friend2')
