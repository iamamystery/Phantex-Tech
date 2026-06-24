from portfolio.models import Project, Technology
from blog.models import Post
from contact.models import Submission
from team.models import Member
from testimonials.models import Testimonial


def dashboard_callback(request, context):
    """
    Provides data for the Unfold admin dashboard overview.
    """
    unread_count = Submission.objects.filter(is_read=False).count()

    context.update({
        "stats": [
            {
                "title": "Active Projects",
                "metric": str(Project.objects.filter(is_active=True).count()),
                "icon": "work",
                "description": "Published & active",
            },
            {
                "title": "Published Posts",
                "metric": str(Post.objects.filter(status='published').count()),
                "icon": "article",
                "description": "Live blog articles",
            },
            {
                "title": "Unread Submissions",
                "metric": str(unread_count),
                "icon": "mail",
                "description": "Contact form leads",
            },
            {
                "title": "Technologies",
                "metric": str(Technology.objects.filter(is_active=True).count()),
                "icon": "code",
                "description": "In tech marquee",
            },
            {
                "title": "Team Members",
                "metric": str(Member.objects.filter(is_active=True).count()),
                "icon": "groups",
                "description": "Active members",
            },
            {
                "title": "Testimonials",
                "metric": str(Testimonial.objects.filter(is_active=True).count()),
                "icon": "star",
                "description": "Active reviews",
            },
        ],
    })
    return context
