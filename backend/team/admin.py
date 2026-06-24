from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import Member


@admin.register(Member)
class MemberAdmin(ModelAdmin):
    list_display  = ['avatar_thumb', 'name', 'role', 'order', 'is_active', 'created_at']
    list_filter   = ['is_active']
    search_fields = ['name', 'role', 'bio']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields     = ['created_at', 'updated_at']
    list_per_page       = 25
    list_display_links  = ['name']

    fieldsets = [
        ('Identity', {
            'fields': ['name', 'slug', 'role', 'is_active', 'order'],
        }),
        ('Profile', {
            'fields': ['bio', 'avatar', 'skills'],
        }),
        ('Contact', {
            'fields': ['email', 'phone_number'],
        }),
        ('Social Links', {
            'fields': ['github', 'linkedin'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
        }),
    ]

    @admin.display(description='Avatar')
    def avatar_thumb(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width:38px;height:38px;border-radius:50%;'
                'object-fit:cover;border:2px solid #e5e7eb;" />',
                obj.avatar.url,
            )
        return format_html('<span style="color:#9ca3af;font-size:12px;">—</span>')
