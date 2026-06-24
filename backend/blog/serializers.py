from rest_framework import serializers

from .models import Author, Category, Post, Tag


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'slug', 'bio', 'avatar', 'role', 'linkedin', 'github']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — no content field."""

    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt',
            'author', 'category', 'tags',
            'status', 'published_at',
            'featured_image', 'read_time', 'view_count', 'is_featured',
        ]


class PostDetailSerializer(PostListSerializer):
    """Full serializer for single-post views — includes HTML content and timestamps."""

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ['content', 'created_at', 'updated_at']
