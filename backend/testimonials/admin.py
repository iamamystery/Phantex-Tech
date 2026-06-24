from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(ModelAdmin):
    list_display  = ['avatar_preview', 'name', 'username', 'excerpt', 'order', 'is_active', 'created_at']
    list_filter   = ['is_active']
    search_fields = ['name', 'username', 'body']
    list_editable = ['order', 'is_active']
    list_per_page = 25
    list_display_links = ['name']
    readonly_fields    = ['created_at']

    fieldsets = [
        ('Person', {
            'fields': ['name', 'username', 'avatar'],
        }),
        ('Testimonial', {
            'fields': ['body'],
        }),
        ('Settings', {
            'fields': ['order', 'is_active'],
        }),
        ('Timestamps', {
            'fields': ['created_at'],
        }),
    ]

    @admin.display(description='Avatar')
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width:38px;height:38px;border-radius:50%;'
                'object-fit:cover;border:2px solid #e5e7eb;" />',
                obj.avatar.url,
            )
        return format_html('<span style="color:#9ca3af;font-size:12px;">—</span>')

    @admin.display(description='Excerpt')
    def excerpt(self, obj):
        if obj.body:
            text = obj.body[:80] + ('…' if len(obj.body) > 80 else '')
            return format_html(
                '<span style="color:#6b7280;font-size:12px;">{}</span>', text
            )
        return '—'
