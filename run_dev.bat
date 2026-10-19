@echo off
echo ========================================================
echo               HustleAI - Launch Script
echo       "Your AI. Your Business. Your Rules."
echo ========================================================
echo.


echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "HustleAI Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://127.0.0.1:5173 ...
start "HustleAI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo HustleAI is running!
echo - Web App: http://127.0.0.1:5173
echo - API Docs: http://127.0.0.1:8000/docs
echo ========================================================
pause
