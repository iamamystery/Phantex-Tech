from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows testimonials to be viewed.
    """
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # We want all active testimonials at once for the marquee
