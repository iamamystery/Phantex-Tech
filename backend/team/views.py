from rest_framework import viewsets

from .models import Member
from .serializers import MemberSerializer


class MemberViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/team/members/        — full list, ordered by Meta.ordering (order, name)
    GET /api/team/members/{slug}/ — single member
    """

    queryset = Member.objects.filter(is_active=True)
    serializer_class = MemberSerializer
    lookup_field = 'slug'
    # Team is small — disable pagination to always return the full list
    pagination_class = None
