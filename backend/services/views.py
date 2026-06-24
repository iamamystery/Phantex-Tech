from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from .models import HowWeWorkSettings, WorkProcessStep
from .serializers import HowWeWorkSettingsSerializer, WorkProcessStepSerializer

class HowWeWorkSettingsViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for retrieving the singleton settings.
    Provides a custom GET /api/services/how-we-work-settings/ endpoint.
    """
    permission_classes = [AllowAny]

    def list(self, request):
        settings = HowWeWorkSettings.load()
        serializer = HowWeWorkSettingsSerializer(settings)
        return Response(serializer.data)

class WorkProcessStepViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset that provides the standard actions for viewing Process Steps.
    """
    queryset = WorkProcessStep.objects.all().order_by('order')
    serializer_class = WorkProcessStepSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # We want the full list of cards at once
