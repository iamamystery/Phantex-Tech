from django.db import models
from django.contrib.auth.models import User

class WhitelistedEmail(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "Whitelisted Email"
        verbose_name_plural = "Whitelisted Emails"

class UserLoginLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_logs')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.email} logged in at {self.timestamp}"

    class Meta:
        verbose_name = "User Login Log"
        verbose_name_plural = "User Login Logs"
        ordering = ['-timestamp']
