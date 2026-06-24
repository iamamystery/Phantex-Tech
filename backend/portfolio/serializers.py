from rest_framework import serializers

from .models import Project, Technology


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list/grid views — no challenge/solution/results."""

    service_type_display = serializers.CharField(
        source='get_service_type_display', read_only=True
    )

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'client',
            'service_type', 'service_type_display',
            'tech_stack', 'thumbnail', 'order', 'is_featured', 'view_count',
        ]


class ProjectDetailSerializer(ProjectListSerializer):
    """Full serializer for case study pages — includes challenge/solution/results."""

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            'challenge', 'solution', 'results',
            'created_at', 'updated_at',
        ]


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name', 'logo_url', 'logo_image', 'description', 'order']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # If both URL and image are provided, URL takes precedence for the marquee
        # but we can return both.
        return ret
