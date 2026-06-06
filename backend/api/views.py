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

    def perform_create(self, serializer):
        instance = serializer.save()
        
        # Send email notification to admin
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            import logging
            
            logger = logging.getLogger(__name__)
            recipient = getattr(settings, 'CONTACT_RECIPIENT_EMAIL', settings.DEFAULT_FROM_EMAIL)
            
            subject = f"Yeni İletişim Mesajı: {instance.name}"
            message = (
                f"Siteniz üzerinden yeni bir iletişim mesajı gönderildi:\n\n"
                f"Gönderen: {instance.name}\n"
                f"E-posta: {instance.email}\n\n"
                f"Mesaj:\n{instance.message}\n"
            )
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient],
                fail_silently=False,
            )
            logger.info(f"Contact email notification sent successfully to {recipient}.")
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send contact email notification: {e}")

class CommentPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve', 'like']:
            return True
        if view.action == 'create':
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or view.action == 'like':
            return True
        if request.user and request.user.is_staff:
            return True
        return obj.user == request.user

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


