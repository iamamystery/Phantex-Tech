from django.db import models


class PageSEO(models.Model):
    page_identifier = models.SlugField(
        max_length=100,
        unique=True,
        help_text=(
            "Unique key for this page's SEO data. "
            "Examples: 'home', 'services', 'services-web-scraping', 'blog'"
        ),
    )
    meta_title = models.CharField(
        max_length=60, help_text='Max 60 characters — Google truncates beyond this'
    )
    meta_description = models.CharField(
        max_length=160, help_text='Max 160 characters — Google truncates beyond this'
    )
    og_title = models.CharField(max_length=100, blank=True)
    og_description = models.CharField(max_length=200, blank=True)
    og_image = models.ImageField(
        upload_to='seo/og/',
        blank=True,
        null=True,
        help_text='Recommended size: 1200x630px',
    )
    canonical_url = models.URLField(
        blank=True, help_text='Leave blank to use the page URL as canonical'
    )
    schema_json = models.JSONField(
        default=dict,
        blank=True,
        help_text='Custom JSON-LD schema override injected directly into the page',
    )
    focus_keyword = models.CharField(max_length=100, blank=True)
    secondary_keywords = models.JSONField(
        default=list,
        blank=True,
        help_text='List of secondary keyword strings',
    )
    no_index = models.BooleanField(
        default=False, help_text='Set True to add noindex meta — use sparingly'
    )
    # auto_now=True ensures last_updated is always set to now() on every save
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['page_identifier']
        verbose_name = 'Page SEO'
        verbose_name_plural = 'Page SEO Entries'

    def __str__(self) -> str:
        return f'{self.page_identifier} — {self.meta_title}'
