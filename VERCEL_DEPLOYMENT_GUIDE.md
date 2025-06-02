# Vercel Environment Variables Setup Guide

## Frontend Environment Variables (.env.local)
Create this file in your frontend directory:

```bash
# Frontend .env.local (for Vercel deployment)
VITE_API_URL=https://your-backend-name.vercel.app
VITE_FRONTEND_URL=https://your-frontend-name.vercel.app
```

## Backend Environment Variables (Vercel Dashboard)
Set these in your Vercel project dashboard:

```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortner

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=production

# Email Configuration (Choose one option below)

# Option 1: Gmail SMTP (Recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Option 2: SendGrid (Alternative)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@your-app.vercel.app

# URLs (Update after deployment)
APP_URI=https://your-backend-name.vercel.app/
FRONTEND_URL=https://your-frontend-name.vercel.app
```

## How to Get Your Vercel URLs

1. Deploy your backend first
2. Note the generated URL (e.g., `https://url-shortner-backend.vercel.app`)
3. Deploy your frontend with the backend URL
4. Update backend environment with frontend URL
5. Redeploy backend if needed
