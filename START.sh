#!/bin/bash

echo "🔬 Drug Interaction Checker - Quick Start"
echo "=========================================="
echo ""
echo "This script starts both backend and frontend."
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

# Start backend
echo "🚀 Starting backend on port 8000..."
cd backend
python3 app.py &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo ""

# Wait for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend on port 3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo ""

echo "✅ Both servers started!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both
wait $BACKEND_PID $FRONTEND_PID
