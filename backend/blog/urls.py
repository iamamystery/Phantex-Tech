from rest_framework.routers import DefaultRouter

from .views import AuthorViewSet, CategoryViewSet, PostViewSet

router = DefaultRouter()
router.register('posts', PostViewSet, basename='post')
router.register('authors', AuthorViewSet, basename='author')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = router.urls
