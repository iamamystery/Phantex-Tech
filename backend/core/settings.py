import os
from pathlib import Path

import dj_database_url
from django.templatetags.static import static
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'insecure-dev-key-change-before-deploying')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'unfold',  # before django.contrib.admin
    'unfold.contrib.filters',  # optional, if you want to use filters
    'unfold.contrib.forms',  # optional, if you want to use forms
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'ckeditor',
    'ckeditor_uploader',
    # Local apps
    'blog',
    'portfolio',
    'team',
    'testimonials',
    'contact',
    'seo',
    'services',
    'admin_custom',
    'authentication',
    # 'scheduling',  # disabled: app source not present in repo (would break startup)
    'social_django',
]

UNFOLD = {
    "SITE_TITLE": "Phantex Tech Admin",
    "SITE_HEADER": "Phantex Tech Admin",
    "SITE_URL": "/",
    "SITE_SYMBOL": "speed",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": False,
    "THEME_MODE": "light",
    "DASHBOARD_CALLBACK": "core.dashboard.dashboard_callback",
    "SITE_LOGO": {
        "light": "/media/logo/company_logo.svg",
        "dark": "/media/logo/company_logo.svg",
    },
    "SITE_FAVICON": "/media/logo/company_logo.svg",
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            {
                "title": "Overview",
                "separator": False,
                "items": [
                    {
                        "title": "Dashboard",
                        "icon": "dashboard",
                        "link": "/admin/",
                    },
                ],
            },
            {
                "title": "Blog",
                "separator": True,
                "items": [
                    {
                        "title": "Posts",
                        "icon": "article",
                        "link": "/admin/blog/post/",
                    },
                    {
                        "title": "Authors",
                        "icon": "person",
                        "link": "/admin/blog/author/",
                    },
                    {
                        "title": "Categories",
                        "icon": "category",
                        "link": "/admin/blog/category/",
                    },
                    {
                        "title": "Tags",
                        "icon": "label",
                        "link": "/admin/blog/tag/",
                    },
                ],
            },
            {
                "title": "Portfolio",
                "separator": True,
                "items": [
                    {
                        "title": "Projects",
                        "icon": "work",
                        "link": "/admin/portfolio/project/",
                    },
                    {
                        "title": "Technologies",
                        "icon": "code",
                        "link": "/admin/portfolio/technology/",
                    },
                ],
            },
            {
                "title": "Team & Social",
                "separator": True,
                "items": [
                    {
                        "title": "Team Members",
                        "icon": "groups",
                        "link": "/admin/team/member/",
                    },
                    {
                        "title": "Testimonials",
                        "icon": "star",
                        "link": "/admin/testimonials/testimonial/",
                    },
                ],
            },
            {
                "title": "Communications",
                "separator": True,
                "items": [
                    {
                        "title": "Contact Submissions",
                        "icon": "mail",
                        "link": "/admin/contact/submission/",
                    },
                ],
            },
            {
                "title": "SEO",
                "separator": True,
                "items": [
                    {
                        "title": "Page SEO",
                        "icon": "manage_search",
                        "link": "/admin/seo/pageseo/",
                    },
                ],
            },
            {
                "title": "Users & Access",
                "separator": True,
                "items": [
                    {
                        "title": "Users",
                        "icon": "manage_accounts",
                        "link": "/admin/auth/user/",
                    },
                ],
            },
        ],
    },
    "STYLES": [
        lambda request: static("admin_custom/variables.css"),
        lambda request: static("admin_custom/reset.css"),
        lambda request: static("admin_custom/layout.css"),
        lambda request: static("admin_custom/components/forms.css"),
        lambda request: static("admin_custom/components/buttons.css"),
        lambda request: static("admin_custom/components/search_bar.css"),
        lambda request: static("admin_custom/components/tables.css"),
        lambda request: static("admin_custom/dashboard_auth.css"),
        lambda request: static("admin_custom/unfold_overrides.css"),
        lambda request: static("admin_custom/misc.css"),
    ],
    "COLORS": {
        "primary": {
            "50":  "238 242 255",
            "100": "224 231 255",
            "200": "199 210 254",
            "300": "165 180 252",
            "400": "129 140 248",
            "500": "99 102 241",
            "600": "79 70 229",
            "700": "67 56 202",
            "800": "55 48 163",
            "900": "49 46 129",
            "950": "30 27 75",
        },
    },
}


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database: uses DATABASE_URL (e.g. Render Postgres) when present, otherwise
# falls back to the local SQLite file so local development is unchanged.
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'core' / 'static',
]

# Whitenoise configuration for production static files
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


MEDIA_URL = '/media/'
# MEDIA_ROOT is overridable so a Render persistent disk can be mounted for
# uploaded media (admin/CKEditor uploads). Defaults to the local folder.
MEDIA_ROOT = os.environ.get('MEDIA_ROOT', str(BASE_DIR / 'media'))

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'core.pagination.StandardPagination',
    'PAGE_SIZE': 12,
}

# CORS — must list exact origins; never use CORS_ALLOW_ALL_ORIGINS=True in production
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get(
        'CORS_ALLOWED_ORIGINS', 'http://localhost:3000'
    ).split(',') if o.strip()
]

# Optionally allow Vercel preview deployments (e.g. https://*.vercel.app) without
# listing each URL. Comma-separated regexes via CORS_ALLOWED_ORIGIN_REGEXES.
CORS_ALLOWED_ORIGIN_REGEXES = [
    r.strip() for r in os.environ.get('CORS_ALLOWED_ORIGIN_REGEXES', '').split(',') if r.strip()
]

# CSRF — required for the Django admin login over HTTPS and any cross-site POSTs.
# Entries MUST include the scheme, e.g. https://your-backend.onrender.com
CSRF_TRUSTED_ORIGINS = [
    o.strip() for o in os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',') if o.strip()
]

# CKEditor
CKEDITOR_UPLOAD_PATH = 'uploads/'
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 400,
        'extraPlugins': ','.join(['codesnippet', 'image2']),
    },
}

SILENCED_SYSTEM_CHECKS = ['ckeditor.W001']

# ---------------------------------------------------------------------------
# Production security hardening
# Only active when DEBUG is off, so local development keeps working over HTTP.
# Render terminates TLS at its proxy and forwards X-Forwarded-Proto, so Django
# must trust that header to know the original request was HTTPS.
# ---------------------------------------------------------------------------
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'True').lower() == 'true'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', '31536000'))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
