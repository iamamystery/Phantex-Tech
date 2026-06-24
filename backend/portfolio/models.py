from django.db import models
from django.db.models import F
from django.utils.text import slugify


class Project(models.Model):
    class ServiceType(models.TextChoices):
        WEB_SCRAPING = 'web-scraping', 'Web Scraping & Data Extraction'
        AUTOMATION = 'automation', 'Browser Automation'
        BACKEND = 'backend', 'Backend Development'
        FRONTEND = 'frontend', 'Frontend Development'
        API = 'api', 'API Development & Integration'
        AI = 'ai', 'AI Integration & Pipelines'

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    client = models.CharField(max_length=255, blank=True)
    service_type = models.CharField(max_length=20, choices=ServiceType.choices)
    tech_stack = models.JSONField(
        default=list, help_text='List of technology name strings'
    )
    challenge = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    results = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, help_text='Lower number appears first'
    )
    is_featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self) -> str:
        return f'{self.title} ({self.get_service_type_display()})'

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def increment_view_count(self) -> None:
        """Atomically increment view_count using F() expression.
        Never assign view_count directly — use this method exclusively.
        """
        Project.objects.filter(pk=self.pk).update(view_count=F('view_count') + 1)
        self.refresh_from_db(fields=['view_count'])


class Technology(models.Model):
    name = models.CharField(max_length=100)
    logo_url = models.URLField(
        max_length=500,
        blank=True,
        help_text='Direct URL to logo (e.g. SVG from CDN)',
    )
    logo_image = models.ImageField(
        upload_to='technologies/',
        blank=True,
        null=True,
        help_text='Upload a logo file if no URL is provided',
    )
    order = models.PositiveIntegerField(
        default=0, help_text='Lower number appears first'
    )
    description = models.TextField(
        blank=True,
        help_text='Short description of how we use this technology'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Technologies'
        ordering = ['order', 'name']

    def __str__(self) -> str:
        return self.name
