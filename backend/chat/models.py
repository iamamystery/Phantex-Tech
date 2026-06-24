from django.db import models


class ChatSession(models.Model):
    session_id = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    visitor_name = models.CharField(max_length=100, blank=True)
    visitor_email = models.CharField(max_length=200, blank=True)
    qualified_service = models.CharField(max_length=100, blank=True)
    qualified_budget = models.CharField(max_length=100, blank=True)
    is_lead = models.BooleanField(default=False)

    def __str__(self):
        return f"Session {self.session_id} — {self.visitor_name or 'Anonymous'}"


class ChatMessage(models.Model):
    ROLE_CHOICES = [("user", "User"), ("assistant", "Assistant")]
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]
