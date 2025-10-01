#!/bin/bash

# Kill any existing processes
echo "🛑 Stopping any existing servers..."
pkill -f "nodemon server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Start Backend
echo "🚀 Starting Backend Server..."
cd /Users/deveshfuloria/Dry-fruits/backend
npm run dev &
BACKEND_PID=$!
sleep 3

# Start Frontend with network access
echo "🎨 Starting Frontend Server with Network Access..."
cd /Users/deveshfuloria/Dry-fruits/dry1
npm run dev:network &
FRONTEND_PID=$!
sleep 5

# Display access URLs
echo ""
echo "================================"
echo "✅ BOTH SERVERS ARE RUNNING!"
echo "================================"
echo ""
echo "📱 ACCESS ON YOUR PHONE:"
echo "   🌐 Website: http://192.168.1.8:5173"
echo "   🔧 Admin:   http://192.168.1.8:5173/admin"
echo ""
echo "💻 ACCESS ON YOUR COMPUTER:"
echo "   🌐 Website: http://localhost:5173"
echo "   🔧 Admin:   http://localhost:5173/admin"
echo ""
echo "🔌 API ENDPOINTS:"
echo "   http://192.168.1.8:5001/api"
echo "   http://localhost:5001/api"
echo ""
echo "================================"
echo ""
echo "⚠️  Keep this terminal window open!"
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait

