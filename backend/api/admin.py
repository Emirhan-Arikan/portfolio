from django.contrib import admin
from .models import Project, Certificate, TechStack, ContactMessage, Comment

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'live_url')
    list_editable = ('order',)
    search_fields = ('title', 'description')

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')
    list_editable = ('order',)
    search_fields = ('title',)

@admin.register(TechStack)
class TechStackAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)
    search_fields = ('name',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    readonly_fields = ('name', 'email', 'message', 'created_at')
    search_fields = ('name', 'email', 'message')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('name', 'likes', 'is_pinned', 'created_at')
    list_editable = ('is_pinned',)
    readonly_fields = ('created_at',)
    search_fields = ('name', 'comment')

