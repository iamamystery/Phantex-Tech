from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import get_object_or_404

from blog.models import Post
from portfolio.models import Project

from .models import PageSEO
from .serializers import PageSEOSerializer

# The 6 service slugs are static (not CMS-driven) — hardcoded here and in Next.js
SERVICE_SLUGS = ['web-scraping', 'automation', 'backend', 'frontend', 'api', 'ai']


class PageSEORetrieveView(APIView):
    """
    GET /api/seo/{page_identifier}/

    Returns SEO metadata for a page. Returns 404 if identifier not found —
    never returns an empty object, so Next.js can detect missing entries.
    """

    def get(self, request, page_identifier: str):
        page_seo = get_object_or_404(PageSEO, page_identifier=page_identifier, is_active=True)
        return Response(PageSEOSerializer(page_seo).data)


class SitemapURLsView(APIView):
    """
    GET /api/sitemap/urls/

    Returns a flat list of all indexable URLs with priority, changefreq, and lastmod.
    Consumed exclusively by frontend/app/sitemap.ts.
    Includes: static pages, 6 service pages, published posts, published projects.
    """

    def get(self, request):
        entries = []

        # --- Static pages ---
        for item in [
            ('/', 1.0, 'daily'),
            ('/services', 0.9, 'weekly'),
            ('/work', 0.8, 'weekly'),
            ('/blog', 0.7, 'weekly'),
            ('/about', 0.5, 'monthly'),
            ('/contact', 0.5, 'monthly'),
        ]:
            entries.append({
                'url': item[0],
                'type': 'static',
                'priority': item[1],
                'changefreq': item[2],
                'lastmod': None,
            })

        # --- Service pages (static slugs) ---
        for slug in SERVICE_SLUGS:
            entries.append({
                'url': f'/services/{slug}',
                'type': 'service',
                'priority': 0.9,
                'changefreq': 'weekly',
                'lastmod': None,
            })

        # --- Published blog posts ---
        posts = Post.objects.filter(
            status=Post.Status.PUBLISHED, is_active=True
        ).values('slug', 'updated_at')

        for post in posts:
            entries.append({
                'url': f'/blog/{post["slug"]}',
                'type': 'post',
                'priority': 0.7,
                'changefreq': 'weekly',
                'lastmod': post['updated_at'].isoformat() if post['updated_at'] else None,
            })

        # --- Published portfolio projects ---
        projects = Project.objects.filter(
            status=Project.Status.PUBLISHED, is_active=True
        ).values('slug', 'updated_at')

        for project in projects:
            entries.append({
                'url': f'/work/{project["slug"]}',
                'type': 'project',
                'priority': 0.8,
                'changefreq': 'weekly',
                'lastmod': project['updated_at'].isoformat() if project['updated_at'] else None,
            })

        return Response(entries)
