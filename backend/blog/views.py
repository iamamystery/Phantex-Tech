from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Author, Category, Post
from .serializers import (
    AuthorSerializer,
    CategorySerializer,
    PostDetailSerializer,
    PostListSerializer,
)


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for published blog posts.

    GET  /api/blog/posts/             — paginated list, filter by ?category=<slug>
    GET  /api/blog/posts/{slug}/      — single post with full content
    POST /api/blog/posts/{slug}/view/ — increment view_count atomically (no GET mutation)
    """

    lookup_field = 'slug'

    def get_queryset(self):
        qs = Post.objects.filter(
            status=Post.Status.PUBLISHED, is_active=True
        ).select_related('author', 'category').prefetch_related('tags')

        category_slug = self.request.query_params.get('category')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        if self.request.query_params.get('featured') == 'true':
            qs = qs.filter(is_featured=True)

        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostListSerializer

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[AllowAny],
        url_path='view',
    )
    def increment_view(self, request, slug=None):
        """
        POST /api/blog/posts/{slug}/view/
        Atomically increments view_count via F() expression in the model method.
        Separated from GET to respect REST semantics — safe methods must not mutate state.
        """
        post = self.get_object()
        post.increment_view_count()
        return Response({'view_count': post.view_count}, status=status.HTTP_200_OK)


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/blog/authors/ and /api/blog/authors/{slug}/"""

    queryset = Author.objects.filter(is_active=True)
    serializer_class = AuthorSerializer
    lookup_field = 'slug'


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/blog/categories/ and /api/blog/categories/{slug}/"""

    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    # Categories are few — disable pagination for this endpoint
    pagination_class = None
