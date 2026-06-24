from django.contrib import admin
from .models import ChatSession, ChatMessage


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('role', 'content', 'timestamp')


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'visitor_name', 'visitor_email', 'is_lead', 'created_at')
    list_filter = ('is_lead', 'created_at')
    search_fields = ('session_id', 'visitor_name', 'visitor_email')
    inlines = [ChatMessageInline]


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'role', 'timestamp')
    list_filter = ('role',)
