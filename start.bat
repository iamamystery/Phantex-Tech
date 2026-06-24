@echo off
title Phantex Tech Development Server

echo Starting Backend (Django :8000)...
start "Backend" cmd /k "cd /d %~dp0backend && python manage.py runserver 8000"

echo Starting Frontend (Next.js :3000)...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --port 3000"

echo.
echo Both servers are running in separate windows.
echo   Backend  → http://localhost:8000
echo   Frontend → http://localhost:3000
echo.
