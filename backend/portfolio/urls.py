from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, TechnologyViewSet

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')
router.register('technologies', TechnologyViewSet, basename='technology')

urlpatterns = router.urls
