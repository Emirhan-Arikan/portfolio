from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Project, Certificate, TechStack, ContactMessage, Comment
from .serializers import (
    ProjectSerializer,
    CertificateSerializer,
    TechStackSerializer,
    ContactMessageSerializer,
    CommentSerializer,
    UserSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TechStackViewSet(viewsets.ModelViewSet):
    queryset = TechStack.objects.all()
    serializer_class = TechStackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ContactMessagePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        return request.user and request.user.is_staff

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [ContactMessagePermission]

class CommentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve', 'like']:
            return True
        if view.action == 'create':
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [CommentPermission]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        comment = self.get_object()
        comment.likes += 1
        comment.save()
        return Response({'likes': comment.likes}, status=status.HTTP_200_OK)


