import os
import django
import sys

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from team.models import Member

def seed():
    members = [
        {
            'name': 'Muhammad Jawad',
            'role': 'CEO & Founder',
            'bio': 'Automation expert with over 10 years of experience in data extraction and backend architecture. Built dozens of high-scale scrapers and AI systems.',
            'skills': ['Python', 'Django', 'Playwright', 'FastAPI'],
            'email': 'jawad@phantextech.com',
            'phone_number': '+44 7700 900077',
            'linkedin': 'https://linkedin.com/company/phantextech',
            'order': 1,
        },
        {
            'name': 'Sarah Chen',
            'role': 'Lead Growth Engineer',
            'bio': 'Specialises in frontend performance and user experience. Ensures every automation tool we build has a world-class interface.',
            'skills': ['Next.js', 'React', 'Tailwind', 'TypeScript'],
            'email': 'sarah@phantextech.com',
            'phone_number': '+44 7700 900088',
            'linkedin': 'https://linkedin.com/in/sarah-chen-growth',
            'order': 2,
        },
        {
            'name': 'Marcus Johnson',
            'role': 'AI & Machine Learning Lead',
            'bio': 'Expert in LLM pipelines and RAG architectures. Marcus bridges the gap between raw data and intelligent insights.',
            'skills': ['GPT-4', 'LangChain', 'LlamaIndex', 'Python'],
            'email': 'marcus@phantextech.com',
            'phone_number': '+44 7700 900099',
            'linkedin': 'https://linkedin.com/in/marcus-johnson-ai',
            'order': 3,
        }
    ]

    for m_data in members:
        member, created = Member.objects.update_or_create(
            name=m_data['name'],
            defaults=m_data
        )
        if created:
            print(f"Created member: {member.name}")
        else:
            print(f"Updated member: {member.name}")

if __name__ == '__main__':
    seed()
