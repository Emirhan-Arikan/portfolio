from rest_framework import serializers
from .models import Project, Certificate, TechStack, ContactMessage, Comment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'

class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['likes', 'is_pinned', 'created_at', 'user']

    def get_name(self, obj):
        if obj.user:
            return obj.user.username
        return obj.name
