from django.contrib import admin
from django.contrib.auth.models import Group
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import Author, Category, Post, Tag

# Remove Groups from admin — not needed for this project
try:
    admin.site.unregister(Group)
except admin.sites.NotRegistered:
    pass


# ─── Actions ───────────────────────────────────────────────────────────────

@admin.action(description='Mark selected posts as Published')
def make_published(modeladmin, request, queryset):
    queryset.update(status=Post.Status.PUBLISHED)


@admin.action(description='Mark selected posts as Draft')
def make_draft(modeladmin, request, queryset):
    queryset.update(status=Post.Status.DRAFT)


# ─── Author ────────────────────────────────────────────────────────────────

@admin.register(Author)
class AuthorAdmin(ModelAdmin):
    list_display  = ['name', 'role', 'avatar_thumb', 'is_active', 'created_at']
    list_filter   = ['is_active']
    search_fields = ['name', 'role', 'bio']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields     = ['created_at', 'updated_at']
    list_per_page       = 25

    fieldsets = [
        ('Identity', {
            'fields': ['name', 'slug', 'role', 'is_active'],
        }),
        ('Profile', {
            'fields': ['bio', 'avatar'],
        }),
        ('Social Links', {
            'fields': ['linkedin', 'github'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
        }),
    ]

    @admin.display(description='Avatar')
    def avatar_thumb(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width:36px;height:36px;border-radius:50%;'
                'object-fit:cover;border:2px solid #e5e7eb;" />',
                obj.avatar.url,
            )
        return format_html('<span style="color:#9ca3af;font-size:12px;">—</span>')


# ─── Category ──────────────────────────────────────────────────────────────

@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display  = ['name', 'slug', 'post_count', 'is_active', 'created_at']
    list_filter   = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields     = ['created_at', 'updated_at']
    list_per_page       = 25

    fieldsets = [
        ('Details', {
            'fields': ['name', 'slug', 'description', 'is_active'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
        }),
    ]

    @admin.display(description='Posts')
    def post_count(self, obj):
        count = obj.posts.filter(is_active=True).count()
        return format_html(
            '<span style="background:#f3f4f6;color:#374151;padding:2px 10px;'
            'border-radius:20px;font-size:11px;font-weight:700;">{}</span>',
            count,
        )


# ─── Tag ───────────────────────────────────────────────────────────────────

@admin.register(Tag)
class TagAdmin(ModelAdmin):
    list_display  = ['name', 'slug', 'is_active', 'created_at']
    list_filter   = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields     = ['created_at', 'updated_at']
    list_per_page       = 25

    fieldsets = [
        ('Details', {
            'fields': ['name', 'slug', 'is_active'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
        }),
    ]


# ─── Post ──────────────────────────────────────────────────────────────────

@admin.register(Post)
class PostAdmin(ModelAdmin):
    list_display = [
        'title', 'author', 'category', 'status_badge',
        'is_featured', 'read_time', 'view_count', 'published_at', 'is_active',
    ]
    list_filter        = ['status', 'is_featured', 'is_active', 'category', 'author']
    search_fields      = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields    = ['created_at', 'updated_at', 'view_count', 'published_at']
    filter_horizontal  = ['tags']
    date_hierarchy     = 'published_at'
    actions            = [make_published, make_draft]
    list_per_page      = 25
    list_display_links = ['title']

    fieldsets = [
        ('Core Info', {
            'fields': [
                'title', 'slug', 'author', 'category', 'tags',
                'status', 'is_featured', 'is_active',
            ],
        }),
        ('Content', {
            'fields': ['excerpt', 'content', 'featured_image', 'read_time'],
        }),
        ('Stats & Dates', {
            'fields': ['view_count', 'published_at', 'created_at', 'updated_at'],
        }),
    ]

    @admin.display(description='Status', ordering='status')
    def status_badge(self, obj):
        if obj.status == Post.Status.PUBLISHED:
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
