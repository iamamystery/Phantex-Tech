from django.db import models
from django.utils import timezone


class Submission(models.Model):
    class ServiceType(models.TextChoices):
        WEB_SCRAPING = 'web-scraping', 'Web Scraping & Data Extraction'
        AUTOMATION = 'automation', 'Browser Automation'
        BACKEND = 'backend', 'Backend Development'
        FRONTEND = 'frontend', 'Frontend Development'
        API = 'api', 'API Development & Integration'
        AI = 'ai', 'AI Integration & Pipelines'
        OTHER = 'other', 'Other / Not Sure'

    class Budget(models.TextChoices):
        UNDER_5K = 'under-5k', 'Under $5,000'
        RANGE_5K_15K = '5k-15k', '$5,000 – $15,000'
        RANGE_15K_50K = '15k-50k', '$15,000 – $50,000'
        OVER_50K = 'over-50k', 'Over $50,000'

    name = models.CharField(max_length=255)
    email = models.EmailField()
    service = models.CharField(max_length=20, choices=ServiceType.choices)
    budget = models.CharField(
        max_length=20, choices=Budget.choices, blank=True
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp of when an admin first marked this as read',
    )
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.name} <{self.email}> — {self.get_service_display()}'

    def mark_as_read(self) -> None:
        """Mark as read and record the exact timestamp. Idempotent."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at', 'updated_at'])
