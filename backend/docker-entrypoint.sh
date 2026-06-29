#!/usr/bin/env sh
# Runtime entrypoint for the Dockerized backend (used by Koyeb).
# Static files are collected at image build time; migrations run here because
# they need the production DATABASE_URL which is only present at runtime.
set -e

# Apply database migrations against the configured database (Neon Postgres).
python manage.py migrate --no-input

# Optionally create the admin superuser on first boot. No-ops if the user
# already exists, and never blocks startup.
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
  python manage.py createsuperuser --no-input || true
fi

# Start the production server. Koyeb injects $PORT (defaults to 8000 locally).
exec gunicorn core.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
