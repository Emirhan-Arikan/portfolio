from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField(max_length=500)
    live_url = models.URLField(max_length=500, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title

class Certificate(models.Model):
    title = models.CharField(max_length=200)
    image_url = models.URLField(max_length=500)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title

class TechStack(models.Model):
    name = models.CharField(max_length=100)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    name = models.CharField(max_length=100, blank=True)
    comment = models.TextField()
    image = models.FileField(upload_to='comments/', blank=True, null=True)
    likes = models.IntegerField(default=0)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"Comment by {self.name or (self.user.username if self.user else 'Anonymous')} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"
