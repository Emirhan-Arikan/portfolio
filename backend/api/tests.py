from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import Comment

class CommentAPITests(APITestCase):
    def setUp(self):
        # Create users
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        
        # Create tokens
        self.token1 = Token.objects.create(user=self.user1)
        self.token2 = Token.objects.create(user=self.user2)
        
        # Create comments
        self.comment1 = Comment.objects.create(user=self.user1, comment='User 1 comment')
        self.comment2 = Comment.objects.create(user=self.user2, comment='User 2 comment')
        
        self.list_url = reverse('comment-list')
        self.detail_url1 = reverse('comment-detail', kwargs={'pk': self.comment1.pk})
        self.detail_url2 = reverse('comment-detail', kwargs={'pk': self.comment2.pk})

    def test_list_comments(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Seed migration 0002 might have some objects, so we assert >= 2
        self.assertGreaterEqual(len(response.data), 2)

    def test_create_comment_anonymous_fails(self):
        response = self.client.post(self.list_url, {'comment': 'Anonymous comment'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_comment_authenticated_success(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.post(self.list_url, {'comment': 'New comment'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['comment'], 'New comment')
        self.assertEqual(response.data['user']['username'], 'user1')

    def test_update_own_comment_success(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.put(self.detail_url1, {'comment': 'Updated comment content'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comment1.refresh_from_db()
        self.assertEqual(self.comment1.comment, 'Updated comment content')

    def test_update_other_comment_fails(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.put(self.detail_url2, {'comment': 'Trying to update user2 comment'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_comment_success(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.delete(self.detail_url1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(pk=self.comment1.pk).exists())

    def test_delete_other_comment_fails(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.delete(self.detail_url2)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comment.objects.filter(pk=self.comment2.pk).exists())
