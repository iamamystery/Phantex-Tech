import os
import django
import sys

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from portfolio.models import Project

def seed():
    projects = [
        {
            'title': 'Real estate lead harvester',
            'description': 'Automated data extraction from 5 major real estate portals, delivering 5,000+ clean leads daily to a CRM.',
            'service_type': 'web-scraping',
            'tech_stack': ['Python', 'Playwright', 'FastAPI', 'PostgreSQL'],
            'challenge': 'Portals had aggressive anti-bot measures and dynamic layout changes.',
            'solution': 'Implemented stealth browser rotation and automated layout detection using LLM-based parsing.',
            'results': 'Increased client lead volume by 300% while reducing lead acquisition cost by 60%.',
            'is_featured': True,
            'status': 'published',
        },
        {
            'title': 'SaaS Competitor Intelligence Dashboard',
            'description': 'Real-time monitoring of pricing and feature updates across 20+ SaaS competitors.',
            'service_type': 'automation',
            'tech_stack': ['Next.js', 'Playwright', 'Django', 'Redis'],
            'challenge': 'Competitors changed pricing pages frequently, breaking standard scrapers.',
            'solution': 'Built a robust automation pipeline with automated error recovery and visual regression detection.',
            'results': 'Zero downtime in tracking over 12 months; provided actionable pricing alerts for the marketing team.',
            'is_featured': True,
            'status': 'published',
        },
        {
            'title': 'AI-Powered Resume Screener',
            'description': 'Custom RAG pipeline for automated resume parsing and matching against job descriptions.',
            'service_type': 'ai',
            'tech_stack': ['GPT-4', 'LangChain', 'FastAPI', 'ChromaDB'],
            'challenge': 'Manual screening took weeks; existing tools lacked nuance.',
            'solution': 'Developed a custom AI pipeline using GPT-4 with a vector database for semantic matching.',
            'results': 'Reduced time-to-interview from 14 days to 48 hours for a mid-sized startup.',
            'is_featured': True,
            'status': 'published',
        },
        {
            'title': 'Internal Inventory Automation System',
            'description': 'Custom desktop browser automation to sync inventory between legacy systems and Shopify.',
            'service_type': 'api',
            'tech_stack': ['Python', 'Playwright', 'Stripe', 'Shopify API'],
            'challenge': 'Legacy system had no API; manual sync took 4 hours daily.',
            'solution': 'Automated the browser interactions with the legacy UI to bridge the gap with modern Shopify APIs.',
            'results': 'Saved 20 hours of manual labor per week; eliminated inventory sync errors.',
            'is_featured': False,
            'status': 'published',
        }
    ]

    for p_data in projects:
        project, created = Project.objects.update_or_create(
            title=p_data['title'],
            defaults=p_data
        )
        if created:
            print(f"Created project: {project.title}")
        else:
            print(f"Updated project: {project.title}")

if __name__ == '__main__':
    seed()
