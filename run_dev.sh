#!/usr/bin/env bash
set -e

echo "========================================================"
echo "              HustleAI - Launch Script"
echo "      \"Your AI. Your Business. Your Rules.\""
echo "========================================================"

# Start backend in background
echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..."
(cd backend && python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload) &
BACKEND_PID=$!

sleep 2

# Start frontend
echo "[2/2] Starting Vite Frontend on http://127.0.0.1:5173 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM

echo ""
echo "========================================================"
echo "HustleAI is running!"
echo "- Web App:  http://127.0.0.1:5173"
echo "- API Docs: http://127.0.0.1:8000/docs"
echo "Press Ctrl+C to stop all servers."
echo "========================================================"

wait
