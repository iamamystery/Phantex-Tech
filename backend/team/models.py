from django.db import models
from django.utils.text import slugify


class Member(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    role = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='team/', blank=True, null=True)
    skills = models.JSONField(
        default=list, help_text='List of skill name strings'
    )
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    order = models.PositiveIntegerField(
        default=0, help_text='Lower number appears first'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self) -> str:
        return f'{self.name} — {self.role}'

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
