from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HowWeWorkSettingsViewSet, WorkProcessStepViewSet

router = DefaultRouter()
router.register(r'work-processes', WorkProcessStepViewSet, basename='work-process-step')
router.register(r'how-we-work-settings', HowWeWorkSettingsViewSet, basename='how-we-work-settings')

urlpatterns = [
    path('', include(router.urls)),
]
