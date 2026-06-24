import os
import sys
import django

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from portfolio.models import Technology

tools = [
    {
        'name': 'Python',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        'description': 'Our primary language for complex automation, data processing, and AI integration pipelines.',
        'order': 10
    },
    {
        'name': 'GitHub',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
        'description': 'Source control and CI/CD pipelines for robust, industrial-grade deployment.',
        'order': 20
    },
    {
        'name': 'FastAPI',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
        'description': 'Blazing fast, high-performance API framework for modern, scalable microservices.',
        'order': 30
    },
    {
        'name': 'Django',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
        'description': 'The foundation of our enterprise backend systems, providing security and reliability.',
        'order': 40
    },
    {
        'name': 'Docker',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        'description': 'Containerization for consistent environment management and seamless deployment.',
        'order': 50
    },
    {
        'name': 'Next.js',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
        'description': 'Modern React framework for lightning-fast, SEO-optimized user interfaces.',
        'order': 60
    },
    {
        'name': 'React',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        'description': 'Component-based library for building dynamic and interactive web applications.',
        'order': 70
    },
    {
        'name': 'TypeScript',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        'description': 'Static typing for large-scale JavaScript applications, ensuring code quality and safety.',
        'order': 80
    },
    {
        'name': 'Tailwind',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
        'description': 'Utility-first CSS framework for rapid and consistent premium UI development.',
        'order': 90
    },
    {
        'name': 'PostgreSQL',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        'description': 'Advanced relational database for reliable and scalable data storage.',
        'order': 100
    },
    {
        'name': 'Redis',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
        'description': 'High-speed caching and message brokering for real-time application performance.',
        'order': 110
    },
    {
        'name': 'Selenium',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg',
        'description': 'Industry-standard browser automation for robust data extraction and scraper stability.',
        'order': 120
    },
    {
        'name': 'VS Code',
        'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
        'description': 'Our preferred development environment for agile and efficient coding workflows.',
        'order': 130
    },
]

for tool in tools:
    Technology.objects.update_or_create(
        name=tool['name'],
        defaults={
            'logo_url': tool['logo_url'], 
            'description': tool['description'],
            'order': tool['order']
        }
    )

print(f"Successfully seeded {len(tools)} technologies.")
