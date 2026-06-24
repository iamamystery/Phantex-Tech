# Phantex Tech

A high-performance automated data extraction and web engineering platform.


## 🚀 ONLY 1 COMMAND SETUP PROJECT 

> Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running before proceeding.
```
docker-compose up --build
```

| Interface | URL |
|-----------|-----|
| Client    | http://localhost:3000 |
| Admin     | http://localhost:8000/admin |

FOR TESTING THE ADMIN PORTAL DEFAULT SUPERUSER CREDENTIALS ARE :
```
Username : admin
Password : admin123
```


## 🏛️ Architecture
- **Backend**: Django REST Framework (Python 3.12)
- **Frontend**: Next.js 14+ (TypeScript, Tailwind CSS)
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Containerization**: Docker Compose
- **Asset Delivery**: Whitenoise (Backend static serving)

---


### Prerequisites
- Docker Desktop installed and running.

### One-Command Setup
```bash
docker-compose up --build
```

Once the build completes:
- **Frontend (UI)**: [http://localhost:3000](http://localhost:3000)
- **Backend (API)**: [http://localhost:8000](http://localhost:8000)
- **Admin Portal**: [http://localhost:8000/admin](http://localhost:8000/admin)

### Docker Management
```bash
# Stop all services
docker-compose down

# Stop and remove all data (volumes)
docker-compose down -v

# Rebuild from scratch (no cache)
docker-compose build 
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🛠️ Local Development Setup

### 1. Backend (Django)

1. **Navigate**: `cd backend`
2. **Virtual Environment**:
   - Windows: `python -m venv venv && .\venv\Scripts\activate`
   - Linux/macOS: `python3 -m venv venv && source venv/bin/activate`
3. **Install**: `pip install -r requirements.txt`
4. **Environment**: Create `.env` in `backend/`:
   ```env
   SECRET_KEY=dev-key-123
   DJANGO_DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```
5. **Run**:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --no-input
   python manage.py runserver
   ```

### 2. Frontend (Next.js)

1. **Navigate**: `cd frontend`
2. **Install**: `npm install`
3. **Environment**: Create `.env.local` in `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. **Run**: `npm run dev`

---

## 📂 Project Structure
See [STRUCTURE.md](./STRUCTURE.md) for full details.

## 📦 Production Notes
- Multi-stage Docker builds for minimal image size.
- Set `DJANGO_DEBUG=False` in production.
- Static assets served by `whitenoise`.
- Media files persisted via Docker volumes in `./backend/media`.
- Database file persisted via Docker volumes in `./backend/db.sqlite3`.
