from django.db import models

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, blank=True)
    body = models.TextField()
    avatar = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0, help_text='Lower number appears first')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self) -> str:
        return f'{self.name} - {self.username}'
