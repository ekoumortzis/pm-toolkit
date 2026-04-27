#!/bin/bash

# PM Toolkit Startup Script
# Make executable with: chmod +x start.sh

echo "🚀 Starting PM Toolkit..."
echo ""

# Check if .env files are configured
if grep -q "YOUR_SUPABASE_PROJECT_URL_HERE" client/.env 2>/dev/null; then
    echo "❌ ERROR: You need to configure Supabase credentials first!"
    echo ""
    echo "📝 Steps:"
    echo "1. Create account at https://supabase.com"
    echo "2. Create new project and wait 2 minutes"
    echo "3. Get credentials from Settings → API"
    echo "4. Run database schema from database/schema.sql"
    echo "5. Update client/.env with your Supabase URL and keys"
    echo "6. Update server/.env with your Supabase credentials"
    echo ""
    echo "📖 See SETUP_GUIDE.md for detailed instructions"
    exit 1
fi

if grep -q "YOUR_SUPABASE_PROJECT_URL_HERE" server/.env 2>/dev/null; then
    echo "❌ ERROR: You need to configure server/.env with Supabase credentials!"
    echo "📖 See SETUP_GUIDE.md for instructions"
    exit 1
fi

echo "✅ Configuration files found"
echo ""
echo "Starting servers..."
echo "- Frontend will run on: http://localhost:3000"
echo "- Backend will run on: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers
cd server && npm run dev &
SERVER_PID=$!

cd ../client && npm run dev &
CLIENT_PID=$!

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
