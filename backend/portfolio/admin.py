from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import Project, Technology


# ─── Actions ───────────────────────────────────────────────────────────────

@admin.action(description='Mark selected projects as Published')
def make_published(modeladmin, request, queryset):
    queryset.update(status=Project.Status.PUBLISHED)


@admin.action(description='Mark selected projects as Draft')
def make_draft(modeladmin, request, queryset):
    queryset.update(status=Project.Status.DRAFT)


# ─── Project ───────────────────────────────────────────────────────────────

@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = [
        'title', 'client', 'service_badge', 'status_badge',
        'is_featured', 'order', 'view_count', 'is_active',
    ]
    list_filter        = ['status', 'service_type', 'is_featured', 'is_active']
    search_fields      = ['title', 'client', 'description', 'challenge', 'solution']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields    = ['created_at', 'updated_at', 'view_count']
    date_hierarchy     = 'created_at'
    actions            = [make_published, make_draft]
    list_per_page      = 25
    list_display_links = ['title']

    fieldsets = [
        ('Core Info', {
            'fields': [
                'title', 'slug', 'client', 'service_type',
                'status', 'is_featured', 'is_active', 'order',
            ],
        }),
        ('Description & Media', {
            'fields': ['description', 'thumbnail'],
        }),
        ('Case Study', {
            'fields': ['challenge', 'solution', 'results'],
        }),
        ('Technical Details', {
            'fields': ['tech_stack'],
        }),
        ('Stats & Dates', {
            'fields': ['view_count', 'created_at', 'updated_at'],
        }),
    ]

    @admin.display(description='Status', ordering='status')
    def status_badge(self, obj):
        if obj.status == Project.Status.PUBLISHED:
            return format_html(
                '<span style="display:inline-flex;align-items:center;gap:5px;'
                'background:#dcfce7;color:#166534;padding:3px 10px;'
                'border-radius:20px;font-size:11px;font-weight:700;">'
                '<span style="width:6px;height:6px;border-radius:50%;'
                'background:#16a34a;flex-shrink:0;"></span>Published</span>'
            )
        return format_html(
            '<span style="display:inline-flex;align-items:center;gap:5px;'
            'background:#f3f4f6;color:#6b7280;padding:3px 10px;'
            'border-radius:20px;font-size:11px;font-weight:700;">'
            '<span style="width:6px;height:6px;border-radius:50%;'
            'background:#9ca3af;flex-shrink:0;"></span>Draft</span>'
        )

    @admin.display(description='Service', ordering='service_type')
    def service_badge(self, obj):
        colors = {
            'WEB_SCRAPING': ('dbeafe', '1d4ed8'),
            'AUTOMATION':   ('fef9c3', '713f12'),
            'BACKEND':      ('f3e8ff', '6b21a8'),
            'FRONTEND':     ('dcfce7', '166534'),
            'API':          ('ffedd5', '9a3412'),
            'AI':           ('fce7f3', '9d174d'),
        }
        bg, text = colors.get(obj.service_type, ('f3f4f6', '374151'))
        return format_html(
            '<span style="background:#{};color:#{};padding:3px 10px;'
            'border-radius:20px;font-size:11px;font-weight:700;">{}</span>',
            bg, text, obj.get_service_type_display(),
        )


# ─── Technology ────────────────────────────────────────────────────────────

@admin.register(Technology)
class TechnologyAdmin(ModelAdmin):
    list_display  = ['name', 'logo_thumb', 'order', 'is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['name']
    list_filter   = ['is_active']
    list_per_page = 50
    readonly_fields = ['created_at']

    fieldsets = [
        ('Details', {
            'fields': ['name', 'description', 'is_active', 'order'],
        }),
        ('Logo', {
            'fields': ['logo_url', 'logo_image'],
        }),
        ('Timestamps', {
            'fields': ['created_at'],
        }),
    ]

    @admin.display(description='Logo')
    def logo_thumb(self, obj):
        if obj.logo_image:
            return format_html(
                '<img src="{}" style="width:32px;height:32px;'
                'object-fit:contain;border-radius:4px;" />',
                obj.logo_image.url,
            )
        if obj.logo_url:
            return format_html(
                '<img src="{}" style="width:32px;height:32px;'
                'object-fit:contain;border-radius:4px;" />',
                obj.logo_url,
            )
        return format_html('<span style="color:#9ca3af;font-size:12px;">—</span>')
