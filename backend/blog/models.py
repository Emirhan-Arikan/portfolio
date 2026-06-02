from django.db import models
from django.utils.text import slugify

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    summary = models.TextField()
    content = models.TextField(blank=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    tags = models.CharField(max_length=200, help_text="Comma-separated tags (e.g. spor,teknoloji)")
    slug = models.SlugField(max_length=200, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
