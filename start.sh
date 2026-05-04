#!/bin/bash
echo "Starting ContactVault..."
echo ""
echo "Starting Flask backend on port 5000..."
cd backend && pip install -r requirements.txt -q && python app.py &
FLASK_PID=$!
echo "Flask started (PID: $FLASK_PID)"
echo ""
echo "Starting React frontend on port 3000..."
cd ../frontend && npm install --silent && npm start
