#!/bin/bash
# Post-Deployment Verification Script

echo "🧪 Email Verification System Test"
echo "================================="

BACKEND_URL="https://usner.vercel.app"
FRONTEND_URL="https://url-shortner-shahzad.vercel.app"

echo "🌐 Testing Production URLs:"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo ""

# Test 1: Backend Health Check
echo "1️⃣ Testing Backend Health..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/debug/db")
if [ "$response" -eq 200 ]; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed (HTTP $response)"
fi

# Test 2: Frontend Route Accessibility
echo ""
echo "2️⃣ Testing Frontend Routes..."

# Test main page
response=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/")
if [ "$response" -eq 200 ]; then
    echo "✅ Homepage accessible"
else
    echo "❌ Homepage failed (HTTP $response)"
fi

# Test verification route (should return 200, not 404)
response=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/verify-email?token=test")
if [ "$response" -eq 200 ]; then
    echo "✅ Verification route accessible (SPA routing working)"
else
    echo "❌ Verification route failed (HTTP $response) - SPA routing issue"
fi

# Test 3: API Endpoints
echo ""
echo "3️⃣ Testing API Endpoints..."

# Test auth endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/auth/me")
if [ "$response" -eq 401 ]; then
    echo "✅ Auth endpoint working (expected 401 without token)"
else
    echo "❌ Auth endpoint unexpected response (HTTP $response)"
fi

# Test 4: Registration Endpoint
echo ""
echo "4️⃣ Testing Registration (with email)..."
test_email="test-$(date +%s)@example.com"
response=$(curl -s -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test User\",\"email\":\"$test_email\",\"password\":\"testpass123\"}")

if [[ $response == *"verification"* ]]; then
    echo "✅ Registration endpoint working (verification message received)"
else
    echo "❌ Registration endpoint issue"
    echo "Response: $response"
fi

echo ""
echo "📋 Manual Tests Required:"
echo "1. Visit: $FRONTEND_URL/register"
echo "2. Register with a real email address"
echo "3. Check email for verification link"
echo "4. Click verification link - should NOT get 404"
echo "5. Should be redirected to dashboard after verification"

echo ""
echo "🎯 Expected Email Verification URL Format:"
echo "$FRONTEND_URL/verify-email?token=VERIFICATION_TOKEN"

echo ""
if [ "$response" -eq 200 ] && [[ $response == *"verification"* ]]; then
    echo "✅ All automated tests passed! Ready for manual testing."
else
    echo "⚠️  Some tests failed. Check above for details."
fi
