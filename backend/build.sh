#!/usr/bin/env bash
# Render build script for the Phantex Tech Django backend.
# Runs from the backend/ directory (set "Root Directory" = backend in Render,
# or rely on render.yaml which sets rootDir: backend).
set -o errexit  # exit on first error

pip install --upgrade pip
pip install -r requirements.txt

# Collect static assets for WhiteNoise (admin + Unfold + admin_custom CSS).
python manage.py collectstatic --no-input

# Apply database migrations against the production database (DATABASE_URL).
python manage.py migrate --no-input

# Optionally create an admin superuser on first deploy. Safe to leave in place:
# it only runs when the three DJANGO_SUPERUSER_* env vars are set, and never
# fails the build if the user already exists.
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
  python manage.py createsuperuser --no-input || true
fi
