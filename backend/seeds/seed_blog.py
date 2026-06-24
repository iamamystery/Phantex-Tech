import os
import django
import sys
from django.utils import timezone

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from blog.models import Post, Category, Author

def seed():
    # Create Category
    cat_automation, _ = Category.objects.get_or_create(name='Automation', slug='automation')
    cat_scraping, _ = Category.objects.get_or_create(name='Web Scraping', slug='web-scraping')
    
    # Create Author
    author, _ = Author.objects.get_or_create(
        name='Muhammad Jawad',
        slug='muhammad-jawad',
        defaults={'bio': 'Founder of Phantex Tech and automation enthusiast.', 'role': 'CEO'}
    )

    posts = [
        {
            'title': 'The Future of Web Scraping in 2026',
            'slug': 'future-of-web-scraping-2026',
            'excerpt': 'How AI and headless browsers are changing the landscape of data extraction.',
            'content': '<h2>The Evolution of Data Extraction</h2><p>Web scraping has come a long way from simple regex filters. In 2026, we see a shift towards AI-powered parsing and more resilient headless browser clusters...</p>',
            'author': author,
            'category': cat_scraping,
            'status': 'published',
            'read_time': 5,
            'is_featured': True,
        },
        {
            'title': 'Why Playwright is the King of Browser Automation',
            'slug': 'why-playwright-king',
            'excerpt': 'A deep dive into why we chose Playwright over Selenium for all our client projects.',
            'content': '<h2>Performance and Reliability</h2><p>When it comes to browser automation, Playwright offers unparalleled speed and a more modern API compared to legacy tools...</p>',
            'author': author,
            'category': cat_automation,
            'status': 'published',
            'read_time': 8,
            'is_featured': False,
        },
        {
            'title': 'Building Scalable APIs with FastAPI',
            'slug': 'scalable-apis-fastapi',
            'excerpt': 'Learn why FastAPI is our go-to framework for high-performance data pipelines.',
            'content': '<h2>Speed is Everything</h2><p>FastAPI leverages Python type hints to provide high performance and auto-generated documentation...</p>',
            'author': author,
            'category': cat_automation,
            'status': 'published',
            'read_time': 6,
            'is_featured': False,
        }
    ]

    for p_data in posts:
        post, created = Post.objects.update_or_create(
            slug=p_data['slug'],
            defaults={**p_data, 'published_at': timezone.now()}
        )
        if created:
            print(f"Created post: {post.title}")
        else:
            print(f"Updated post: {post.title}")

if __name__ == '__main__':
    seed()
