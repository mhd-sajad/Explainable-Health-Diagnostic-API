#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦  Installing Python dependencies..."
python -m pip install --upgrade pip 2>/dev/null || true
pip install -r requirements.txt --break-system-packages 2>/dev/null || pip install -r requirements.txt

echo "🧠  Training & generating ML model artifact..."
python model/train.py

echo "⚡  Building Frontend static assets..."
cd frontend
npm install
npm run build
cd ..

echo "✅  Render Build Completed Successfully!"
