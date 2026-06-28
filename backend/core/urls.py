from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

from seo.views import SitemapURLsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/portfolio/', include('portfolio.urls')),
    path('api/team/', include('team.urls')),
    path('api/testimonials/', include('testimonials.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/seo/', include('seo.urls')),
    path('api/services/', include('services.urls')),
    # path('api/scheduling/', include('scheduling.urls')),  # disabled: scheduling app source not present
    path('api/sitemap/urls/', SitemapURLsView.as_view(), name='sitemap-urls'),
    path('auth/', include('social_django.urls', namespace='social')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
