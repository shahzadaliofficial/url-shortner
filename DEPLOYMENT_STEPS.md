# Step-by-Step Vercel Deployment Guide

## Prerequisites
1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Set up MongoDB Atlas (free tier) at https://cloud.mongodb.com

## Step 1: Prepare Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster (free tier)
3. Create a database user
4. Get your connection string (replace `<password>` with actual password)
5. Whitelist all IPs (0.0.0.0/0) for Vercel deployment

## Step 2: Set Up Email Service (Gmail Example)
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" for your application
3. Use this app password in your environment variables

## Step 3: Deploy Backend First

### 3.1 Create vercel.json for backend
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ]
}
```

### 3.2 Deploy backend
```bash
cd backend
vercel
```

### 3.3 Set environment variables in Vercel dashboard
1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add all variables from .env.production file

### 3.4 Note your backend URL
Example: `https://url-shortner-backend-abc123.vercel.app`

## Step 4: Deploy Frontend

### 4.1 Create .env.local in frontend
```bash
VITE_API_URL=https://your-backend-url.vercel.app
```

### 4.2 Deploy frontend
```bash
cd frontend
vercel
```

### 4.3 Note your frontend URL
Example: `https://url-shortner-frontend-xyz789.vercel.app`

## Step 5: Update Backend Environment

1. Go to backend Vercel project settings
2. Update `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy backend:
```bash
cd backend
vercel --prod
```

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Test registration with email verification
3. Check email delivery
4. Test login and dashboard access

## Example Final URLs Structure

```
Backend:  https://url-shortner-backend.vercel.app
Frontend: https://url-shortner-frontend.vercel.app
Database: MongoDB Atlas cluster
Email:    Gmail SMTP
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure FRONTEND_URL is set correctly in backend
2. **Database connection**: Check MongoDB Atlas IP whitelist and connection string
3. **Email not sending**: Verify Gmail app password and SMTP settings
4. **Environment variables**: Ensure all variables are set in Vercel dashboard

### Useful Commands:
```bash
# Check deployment logs
vercel logs <deployment-url>

# Force redeploy
vercel --prod --force

# Check environment variables
vercel env ls
```

## Production Checklist
- [ ] MongoDB Atlas cluster created and configured
- [ ] Email service configured (Gmail/SendGrid)
- [ ] Backend deployed with all environment variables
- [ ] Frontend deployed with correct backend URL
- [ ] CORS configuration updated
- [ ] Email verification tested
- [ ] All features working on production URLs
