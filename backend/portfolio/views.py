from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Project, Technology
from .serializers import (
    ProjectDetailSerializer,
    ProjectListSerializer,
    TechnologySerializer
)


class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for technologies to be used in the marquee."""
    queryset = Technology.objects.filter(is_active=True)
    serializer_class = TechnologySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for published portfolio projects.

    GET  /api/portfolio/projects/             — paginated list, filter by ?service_type=<slug>
    GET  /api/portfolio/projects/{slug}/      — single project with full case study
    POST /api/portfolio/projects/{slug}/view/ — increment view_count atomically (no GET mutation)
    """

    lookup_field = 'slug'

    def get_queryset(self):
        qs = Project.objects.filter(status=Project.Status.PUBLISHED, is_active=True)

        service_type = self.request.query_params.get('service_type')
        if service_type:
            qs = qs.filter(service_type=service_type)

        if self.request.query_params.get('featured') == 'true':
            qs = qs.filter(is_featured=True)

        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[AllowAny],
        url_path='view',
    )
    def increment_view(self, request, slug=None):
        """
        POST /api/portfolio/projects/{slug}/view/
        Atomically increments view_count. Never mutated on GET.
        """
        project = self.get_object()
        project.increment_view_count()
        return Response({'view_count': project.view_count}, status=status.HTTP_200_OK)
