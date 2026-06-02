from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    CertificateViewSet,
    TechStackViewSet,
    ContactMessageViewSet,
    CommentViewSet
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'certificates', CertificateViewSet, basename='certificate')
router.register(r'techstack', TechStackViewSet, basename='techstack')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
