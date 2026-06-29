FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/staticfiles /app/media /app/core/static

# Collect static assets at build time (no DB needed; uses settings defaults).
RUN python manage.py collectstatic --no-input

RUN chmod +x /app/docker-entrypoint.sh

# Koyeb provides $PORT; the entrypoint binds it (defaults to 8000 locally).
EXPOSE 8000

# Runtime: migrate -> (optional) create superuser -> start gunicorn.
CMD ["sh", "/app/docker-entrypoint.sh"]
