import os
import django
import requests
from django.core.files.base import ContentFile

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from testimonials.models import Testimonial

def seed_testimonials():
    reviews = [
        {
            "name": "Sarah Chen",
            "username": "@sarahc_fintech",
            "body": "Phantex Tech transformed our data collection process. Their scrapers are rock-solid and handle our high-volume requirements without breaking. A total game-changer for our market analysis.",
            "img": "https://i.pravatar.cc/150?u=sarah",
        },
        {
            "name": "Marcus Thorne",
            "username": "@mthorne_saas",
            "body": "The AI pipelines Phantex Tech built for us have automated 90% of our lead qualification. The integration was seamless, and the performance is incredible. Highly recommended!",
            "img": "https://i.pravatar.cc/150?u=marcus",
        },
        {
            "name": "Elena Rodriguez",
            "username": "@elena_dev_lead",
            "body": "Finally, a team that understands the complexity of modern web automation. They navigate anti-bot measures like pros. Our engineering team can finally focus on product instead of maintenance.",
            "img": "https://i.pravatar.cc/150?u=elena",
        },
        {
            "name": "Dr. Aris Varma",
            "username": "@arisv_biotech",
            "body": "The precision of the data extraction tool Phantex Tech developed for our research is unmatched. Their expertise in Python and Playwright is evident in every line of code.",
            "img": "https://i.pravatar.cc/150?u=aris",
        },
        {
            "name": "Jessica Low",
            "username": "@jesslow_ops",
            "body": "Working with Phantex Tech was the best decision we made this year. They didn't just build a tool; they provided a strategic automation partner that scales with our growth.",
            "img": "https://i.pravatar.cc/150?u=jessica",
        },
        {
            "name": "David Park",
            "username": "@dpark_growth",
            "body": "The speed and reliability of their browser automation scripts are impressive. We've seen a 4x increase in our data processing speed since implementation. Professional and highly skilled.",
            "img": "https://i.pravatar.cc/150?u=david",
        },
        {
            "name": "Sophia Moretti",
            "username": "@sophia_founder",
            "body": "Phantex Tech delivered a custom AI solution that literally saved us hundreds of man-hours a month. Their communication is top-notch, and the delivery was on schedule.",
            "img": "https://i.pravatar.cc/150?u=sophia",
        },
        {
            "name": "Alex Rivera",
            "username": "@arivera_cto",
            "body": "I've worked with many scraping agencies, but Phantex Tech is in a league of their own. Their code is clean, documented, and exceptionally performant. They truly are the experts.",
            "img": "https://i.pravatar.cc/150?u=alex",
        },
        {
            "name": "Linda Wu",
            "username": "@lindawu_ecom",
            "body": "Their price monitoring automation has been flawless. We now have real-time insights into our competitors without any manual effort. Simply brilliant execution.",
            "img": "https://i.pravatar.cc/150?u=linda",
        },
        {
            "name": "Tom Harrison",
            "username": "@tomh_product",
            "body": "The dashboard integration they provided for our data pipelines is sleek and intuitive. Phantex Tech doesn't just do the backend; they understand the importance of a great UX.",
            "img": "https://i.pravatar.cc/150?u=tom",
        },
    ]

    print(f"Seeding {len(reviews)} testimonials...")

    # Clear existing testimonials to allow clean re-seeding
    Testimonial.objects.all().delete()

    for i, review in enumerate(reviews):
        testimonial, created = Testimonial.objects.get_or_create(
            name=review['name'],
            defaults={
                'username': review['username'],
                'body': review['body'],
                'order': i,
                'is_active': True
            }
        )

        if created or not testimonial.avatar:
            # Download avatar
            try:
                response = requests.get(review['img'])
                if response.status_code == 200:
                    filename = f"{review['name'].lower().replace(' ', '_')}.png"
                    testimonial.avatar.save(
                        filename,
                        ContentFile(response.content),
                        save=True
                    )
            except Exception as e:
                print(f"Failed to download image for {review['name']}: {e}")
            
            print(f"Created/Updated testimonial for {review['name']}")
        else:
            print(f"Testimonial for {review['name']} already exists")

if __name__ == "__main__":
    seed_testimonials()
    print("Done!")
