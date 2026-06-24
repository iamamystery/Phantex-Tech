from social_core.exceptions import AuthForbidden
from .models import WhitelistedEmail, UserLoginLog

def whitelist_by_email(backend, details, response, *args, **kwargs):
    email = details.get('email')
    if email and not WhitelistedEmail.objects.filter(email=email, is_active=True).exists():
        raise AuthForbidden(backend)

def log_user_login(backend, user, response, *args, **kwargs):
    if user:
        request = kwargs.get('request')
        ip_address = None
        user_agent = None
        if request:
            ip_address = request.META.get('REMOTE_ADDR')
            user_agent = request.META.get('HTTP_USER_AGENT')
        
        UserLoginLog.objects.create(
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
            success=True
        )
