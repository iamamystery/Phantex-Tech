from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import Submission


# ─── Actions ───────────────────────────────────────────────────────────────

@admin.action(description='Mark selected submissions as Read')
def mark_as_read(modeladmin, request, queryset):
    for submission in queryset.filter(is_read=False):
        submission.mark_as_read()


# ─── Submission ────────────────────────────────────────────────────────────

@admin.register(Submission)
class SubmissionAdmin(ModelAdmin):
    list_display = [
        'name', 'email', 'service_badge', 'budget_badge',
        'read_status', 'created_at',
    ]
    list_filter   = ['is_read', 'service', 'budget', 'is_active']
    search_fields = ['name', 'email', 'message']
    date_hierarchy = 'created_at'
    list_per_page  = 25
    actions        = [mark_as_read]
    list_display_links = ['name']

    readonly_fields = [
        'name', 'email', 'service', 'budget', 'message',
        'created_at', 'updated_at', 'read_at',
    ]

    fieldsets = [
        ('Submission Details', {
            'fields': ['name', 'email', 'service', 'budget', 'message'],
        }),
        ('Status & Notes', {
            'fields': ['is_read', 'read_at', 'is_active', 'admin_notes'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
        }),
    ]

    def has_add_permission(self, request) -> bool:
        return False

    @admin.display(description='Read Status', ordering='is_read')
    def read_status(self, obj):
        if obj.is_read:
            return format_html(
                '<span style="background:#dcfce7;color:#166534;padding:3px 10px;'
                'border-radius:20px;font-size:11px;font-weight:700;">Read</span>'
            )
        return format_html(
            '<span style="background:#fef2f2;color:#dc2626;padding:3px 10px;'
            'border-radius:20px;font-size:11px;font-weight:700;">● Unread</span>'
        )

    @admin.display(description='Service', ordering='service')
    def service_badge(self, obj):
        colors = {
            'WEB_SCRAPING': ('dbeafe', '1d4ed8'),
            'AUTOMATION':   ('fef9c3', '713f12'),
            'BACKEND':      ('f3e8ff', '6b21a8'),
            'FRONTEND':     ('dcfce7', '166534'),
            'API':          ('ffedd5', '9a3412'),
            'AI':           ('fce7f3', '9d174d'),
            'OTHER':        ('f3f4f6', '374151'),
        }
        bg, text = colors.get(obj.service, ('f3f4f6', '374151'))
        return format_html(
            '<span style="background:#{};color:#{};padding:3px 10px;'
            'border-radius:20px;font-size:11px;font-weight:700;">{}</span>',
            bg, text, obj.get_service_display(),
        )

    @admin.display(description='Budget', ordering='budget')
    def budget_badge(self, obj):
        return format_html(
            '<span style="background:#f8fafc;color:#374151;padding:3px 10px;'
            'border-radius:20px;font-size:11px;font-weight:600;'
            'border:1px solid #e5e7eb;">{}</span>',
            obj.get_budget_display(),
        )
