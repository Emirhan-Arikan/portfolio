from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, RegisterView, LoginView
from .views_auth import (
    PasswordResetRequestView,
    PasswordResetConfirmView,
    GithubLoginView,
    GoogleLoginView
)

router = DefaultRouter()
router.register(r'blogs', BlogPostViewSet, basename='blog')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('auth/github/', GithubLoginView.as_view(), name='auth_github'),
    path('auth/google/', GoogleLoginView.as_view(), name='auth_google'),
    path('', include(router.urls)),
]
