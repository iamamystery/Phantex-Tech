from rest_framework import serializers

from .models import PageSEO


class PageSEOSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSEO
        fields = [
            'page_identifier',
            'meta_title',
            'meta_description',
            'og_title',
            'og_description',
            'og_image',
            'canonical_url',
            'schema_json',
            'focus_keyword',
            'secondary_keywords',
            'no_index',
            'last_updated',
        ]
