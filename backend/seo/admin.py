from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import PageSEO


@admin.register(PageSEO)
class PageSEOAdmin(ModelAdmin):
    list_display = [
        'page_identifier', 'meta_title_truncated', 'focus_keyword',
        'index_status', 'is_active', 'last_updated',
    ]
    list_filter   = ['no_index', 'is_active']
    search_fields = ['page_identifier', 'meta_title', 'meta_description', 'focus_keyword']
    readonly_fields = ['last_updated', 'created_at']
    list_per_page   = 25
    list_display_links = ['page_identifier']

    fieldsets = [
        ('Identification', {
            'fields': ['page_identifier', 'is_active', 'no_index', 'focus_keyword'],
        }),
        ('Meta Tags', {
            'fields': [
                'meta_title', 'meta_description', 'secondary_keywords',
            ],
        }),
        ('Open Graph', {
            'fields': ['og_title', 'og_description', 'og_image'],
        }),
        ('Advanced', {
            'fields': ['canonical_url', 'schema_json'],
        }),
        ('Timestamps', {
            'fields': ['last_updated', 'created_at'],
        }),
    ]

    @admin.display(description='Meta Title', ordering='meta_title')
    def meta_title_truncated(self, obj):
        if not obj.meta_title:
            return format_html('<span style="color:#dc2626;font-size:12px;font-weight:600;">Missing</span>')
        length = len(obj.meta_title)
        color = '#166534' if length <= 60 else '#dc2626'
        text  = obj.meta_title[:55] + ('…' if length > 55 else '')
        return format_html(
            '{} <span style="color:{};font-size:10px;font-weight:700;">[{}]</span>',
            text, color, length,
        )

    @admin.display(description='Indexing', ordering='no_index')
    def index_status(self, obj):
        if obj.no_index:
            return format_html(
                '<span style="background:#fef2f2;color:#dc2626;padding:3px 10px;'
                'border-radius:20px;font-size:11px;font-weight:700;">No-Index</span>'
            )
        return format_html(
            '<span style="background:#dcfce7;color:#166534;padding:3px 10px;'
            'border-radius:20px;font-size:11px;font-weight:700;">Indexed</span>'
        )
