import os
import sys
import django
import requests
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import timedelta

# Set up Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from portfolio.models import Project
from blog.models import Post, Category, Author, Tag
from team.models import Member
from seo.models import PageSEO

def download_image(url, filename):
    print(f"Downloading {filename} from {url}...")
    try:
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            return ContentFile(response.content, name=filename)
        else:
            print(f"Failed to download {filename} (Status: {response.status_code})")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
    return None

def clear_db():
    print("Clearing existing data...")
    Project.objects.all().delete()
    Post.objects.all().delete()
    Category.objects.all().delete()
    Author.objects.all().delete()
    Tag.objects.all().delete()
    Member.objects.all().delete()
    PageSEO.objects.all().delete()
    # Remove all media files
    media_root = django.conf.settings.MEDIA_ROOT
    if os.path.exists(media_root):
        import shutil
        shutil.rmtree(media_root)
    os.makedirs(os.path.join(media_root, 'portfolio'), exist_ok=True)
    os.makedirs(os.path.join(media_root, 'blog'), exist_ok=True)
    os.makedirs(os.path.join(media_root, 'authors'), exist_ok=True)
    os.makedirs(os.path.join(media_root, 'team'), exist_ok=True)

def seed_team_and_authors():
    print("Seeding Team and Authors...")
    people = [
        {
            'name': 'Muhammad Jawad',
            'role': 'CEO & Founder',
            'bio': 'Data engineering veteran with 10+ years scaling Python automation architectures. Prev: Lead Data Engineer at Stripe.',
            'skills': ['Python', 'System Architecture', 'Go', 'Data Pipelines'],
            'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=600&h=600&q=80',
            'filename': 'alex.jpg'
        },
        {
            'name': 'Sarah Chen',
            'role': 'Head of Engineering',
            'bio': 'Open-source maintainer and browser automation expert. Solves CAPTCHAs for breakfast.',
            'skills': ['Playwright', 'TypeScript', 'Node.js', 'Distributed Systems'],
            'image_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=600&h=600&q=80',
            'filename': 'sarah.jpg'
        },
        {
            'name': 'Marcus Johnson',
            'role': 'Lead AI Engineer',
            'bio': 'Machine learning specialist focusing on applied LLMs, RAG pipelines, and semantic data extraction.',
            'skills': ['PyTorch', 'LangChain', 'OpenAI API', 'FastAPI'],
            'image_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=600&h=600&q=80',
            'filename': 'marcus.jpg'
        }
    ]

    authors = {}
    for i, p in enumerate(people):
        img_content = download_image(p['image_url'], p['filename'])
        
        # Create Team Member
        member = Member.objects.create(
            name=p['name'],
            role=p['role'],
            bio=p['bio'],
            skills=p['skills'],
            order=i,
            linkedin='https://linkedin.com',
            github='https://github.com'
        )
        if img_content:
            member.avatar.save(p['filename'], img_content, save=True)

        # Create Blog Author
        author = Author.objects.create(
            name=p['name'],
            bio=p['bio'],
            role=p['role'],
            linkedin='https://linkedin.com',
            github='https://github.com'
        )
        if img_content:
            author.avatar.save(p['filename'], img_content, save=True)
            
        authors[p['name']] = author
    
    return authors

def seed_blog(authors):
    print("Seeding Blog...")
    # Categories
    cat_scraping = Category.objects.create(name='Web Scraping', description='Guides and theories on data extraction.')
    cat_automation = Category.objects.create(name='Automation', description='Browser automation and workflow scripting.')
    cat_ai = Category.objects.create(name='AI Pipelines', description='Applied LLMs and RAG architectures.')
    
    # Tags
    tags = {name: Tag.objects.create(name=name) for name in ['Playwright', 'Python', 'FastAPI', 'LLMs', 'Data Engineering']}
    
    posts = [
        {
            'title': 'The Death of Traditional Web Scraping',
            'excerpt': 'Why DOM parsing is failing and how visual AI agents are replacing standard DOM selectors in 2026.',
            'content': '<h2>The Brittle Nature of Selectors</h2><p>For decades, web scraping relied on XPath and CSS selectors. But as modern JS frameworks dynamicize the DOM, these break daily. Today, we are seeing a mass migration toward visual-based LLM parsing and headless cluster orchestration.</p><p>We have successfully deployed computer vision scrapers that don\'t care about class names changing. They "look" at the page like a human.</p>',
            'author': authors['Sarah Chen'],
            'category': cat_scraping,
            'image_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fit=crop&w=1200&h=630&q=80',
            'filename': 'matrix-code.jpg',
            'tags': [tags['Python'], tags['Data Engineering']],
            'read_time': 6,
            'days_ago': 2
        },
        {
            'title': 'Scaling Playwright to 1000 Concurrent Instances',
            'excerpt': 'Architecture deep-dive into how we built a distributed browser automation grid on AWS.',
            'content': '<h2>The Memory Problem</h2><p>Chromium is hungry. Running 1000 instances requires serious orchestration. We bypassed standard Docker limits by using a custom AWS ECS cluster with memory-optimized instances and dynamic scaling based on queue depth.</p><h2>The Solution</h2><p>By routing instructions through a centralized Redis queue and letting worker nodes consume tasks agnostically, we achieved 99.99% success rates on complex authenticated workflows.</p>',
            'author': authors['Muhammad Jawad'],
            'category': cat_automation,
            'image_url': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?fit=crop&w=1200&h=630&q=80',
            'filename': 'server-rack.jpg',
            'tags': [tags['Playwright'], tags['Python']],
            'read_time': 8,
            'days_ago': 10
        },
        {
            'title': 'RAG is Not Enough: Building Agentic Data Pipelines',
            'excerpt': 'Retrieval-Augmented Generation is just step one. True automation requires agentic decision making.',
            'content': '<h2>Beyond Vector Search</h2><p>Everyone has a RAG pipeline now. But what happens when the retrieved context requires a multi-step action? This is where Agentic workflows come in.</p><p>Using LangChain and semantic routing, we build systems that don\'t just answer questions—they execute authenticated browser workflows based on the answers.</p>',
            'author': authors['Marcus Johnson'],
            'category': cat_ai,
            'image_url': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?fit=crop&w=1200&h=630&q=80',
            'filename': 'ai-chip.jpg',
            'tags': [tags['LLMs'], tags['FastAPI']],
            'read_time': 5,
            'days_ago': 15
        }
    ]

    for p in posts:
        img_content = download_image(p['image_url'], p['filename'])
        post = Post.objects.create(
            title=p['title'],
            excerpt=p['excerpt'],
            content=p['content'],
            author=p['author'],
            category=p['category'],
            status=Post.Status.PUBLISHED,
            read_time=p['read_time'],
            published_at=timezone.now() - timedelta(days=p['days_ago']),
            is_featured=p['days_ago'] < 5
        )
        post.tags.set(p['tags'])
        if img_content:
            post.featured_image.save(p['filename'], img_content, save=True)

def seed_portfolio():
    print("Seeding Portfolio...")
    projects = [
        {
            'title': 'Global Real Estate Lead Harvester',
            'description': 'Automated data extraction from 5 major real estate portals, delivering 5,000+ clean leads daily to a CRM.',
            'client': 'PropTech Dynamics',
            'service_type': 'web-scraping',
            'tech_stack': ['Python', 'Playwright', 'FastAPI', 'PostgreSQL'],
            'challenge': 'Portals had aggressive anti-bot measures, Cloudflare protection, and dynamic layout changes that broke standard scrapers.',
            'solution': 'Implemented stealth browser rotation, residential proxies, and automated layout detection using LLM-based parsing.',
            'results': 'Increased client lead volume by 300% while reducing lead acquisition cost by 60%. Zero blocks in 6 months.',
            'image_url': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?fit=crop&w=1200&h=800&q=80',
            'filename': 'real-estate-dash.jpg',
            'is_featured': True,
            'order': 1
        },
        {
            'title': 'SaaS Competitor Intelligence Matrix',
            'description': 'Real-time monitoring of pricing and feature updates across 20+ SaaS competitors.',
            'client': 'SaaSify Platforms',
            'service_type': 'automation',
            'tech_stack': ['Next.js', 'Playwright', 'Django', 'Redis'],
            'challenge': 'Competitors changed pricing pages and feature matrices frequently, requiring constant scraper maintenance.',
            'solution': 'Built a robust automation pipeline with automated error recovery and visual regression detection to flag page changes instantly.',
            'results': 'Zero downtime in tracking over 12 months; provided actionable pricing alerts that directly led to a 12% revenue bump for the client.',
            'image_url': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?fit=crop&w=1200&h=800&q=80',
            'filename': 'competitor-matrix.jpg',
            'is_featured': True,
            'order': 2
        },
        {
            'title': 'AI-Powered Enterprise Resume Screener',
            'description': 'Custom RAG pipeline for automated resume parsing and matching against complex engineering job descriptions.',
            'client': 'TechTalent Inc.',
            'service_type': 'ai',
            'tech_stack': ['GPT-4', 'LangChain', 'FastAPI', 'ChromaDB'],
            'challenge': 'Manual screening took weeks per role. Existing ATS tools relied on simple keyword matching which missed nuanced engineering experience.',
            'solution': 'Developed a custom AI pipeline using GPT-4 with a local ChromaDB vector database for highly accurate semantic matching.',
            'results': 'Reduced time-to-interview from 14 days to 48 hours. Improved candidate quality score by 40%.',
            'image_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?fit=crop&w=1200&h=800&q=80',
            'filename': 'ai-screener.jpg',
            'is_featured': True,
            'order': 3
        },
        {
            'title': 'Legacy Manufacturing Inventory Sync',
            'description': 'Custom desktop browser automation to sync inventory between a 1990s legacy ERP and Shopify.',
            'client': 'Apex Manufacturing',
            'service_type': 'api',
            'tech_stack': ['Python', 'Selenium', 'Shopify API', 'AWS Lambda'],
            'challenge': 'The legacy ERP system had no API and a complex web wrapper that required human interaction to export data.',
            'solution': 'Automated the browser interactions with the legacy UI to scrape the data, transform it, and push it to modern Shopify APIs hourly.',
            'results': 'Saved 20 hours of manual data entry per week; completely eliminated inventory sync errors that were causing overselling.',
            'image_url': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?fit=crop&w=1200&h=800&q=80',
            'filename': 'legacy-api.jpg',
            'is_featured': False,
            'order': 4
        }
    ]

    for p in projects:
        img_content = download_image(p['image_url'], p['filename'])
        project = Project.objects.create(
            title=p['title'],
            description=p['description'],
            client=p['client'],
            service_type=p['service_type'],
            tech_stack=p['tech_stack'],
            challenge=p['challenge'],
            solution=p['solution'],
            results=p['results'],
            status=Project.Status.PUBLISHED,
            is_featured=p['is_featured'],
            order=p['order']
        )
        if img_content:
            project.thumbnail.save(p['filename'], img_content, save=True)

def seed_seo():
    print("Seeding SEO metadata...")
    pages = [
        ('home', 'Web Automation Agency for SaaS Startups | Phantex Tech', 'Phantex Tech is a web automation agency helping SaaS startups scale with web scraping, AI pipelines, backend systems, and custom automation.'),
        ('services', 'Automation and Scraping Services | Phantex Tech', 'Explore our production-ready web automation, scraping, and AI integration services designed for modern SaaS teams.'),
        ('work', 'Automation & Scraping Projects Portfolio | Phantex Tech', 'View our portfolio of successful web scraping, browser automation, and AI integration projects.'),
        ('blog', 'Web Scraping & Automation Tutorials | Phantex Tech', 'Read the latest thoughts, tutorials, and deep-dives on engineering robust automation pipelines.'),
        ('about', 'Phantex Tech Web Automation Agency Team', 'Meet the engineering team behind Phantex Tech. We are data extraction and automation specialists.'),
        ('contact', 'Hire Web Automation Agency | Phantex Tech', 'Ready to scale? Contact Phantex Tech for a technical consultation today.'),
    ]
    for identifier, title, desc in pages:
        PageSEO.objects.create(
            page_identifier=identifier,
            meta_title=title,
            meta_description=desc,
            focus_keyword=identifier
        )

if __name__ == '__main__':
    print("Starting comprehensive seed script...")
    clear_db()
    authors = seed_team_and_authors()
    seed_blog(authors)
    seed_portfolio()
    seed_seo()
    print("Done! Database populated with premium demo data.")
