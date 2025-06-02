#!/bin/bash

echo "Testing Email Verification Implementation"
echo "========================================"

# Start backend server in background
cd /home/shahzad-ali/Desktop/projects/URL-Shortner/backend
node app.js &
BACKEND_PID=$!

sleep 3

echo -e "\n1. Testing user registration with email verification..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Email Test User","email":"emailtest@example.com","password":"password123"}')

echo "Registration Response: $REGISTER_RESPONSE"

echo -e "\n2. Testing login with unverified email..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"emailtest@example.com","password":"password123"}')

echo "Login Response: $LOGIN_RESPONSE"

echo -e "\n3. Testing resend verification email..."
RESEND_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"emailtest@example.com"}')

echo "Resend Response: $RESEND_RESPONSE"

# Clean up
kill $BACKEND_PID 2>/dev/null

echo -e "\n\nTest completed!"
echo "Summary:"
echo "- Registration should indicate verification required"
echo "- Login should fail for unverified email"
echo "- Resend verification should succeed"
