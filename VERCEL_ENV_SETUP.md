# 🚀 Vercel Environment Variables Setup

## Backend Environment Variables

Add these in Vercel Dashboard → `url-shortner-sand-seven` → Settings → Environment Variables:

```bash
MONGO_URI=mongodb+srv://admin-url-shortner:admin-url-shortner@clusterproject0.2pkm7ns.mongodb.net/url-shortner?retryWrites=true&w=majority
FRONTEND_URL=https://url-shortner-react-swart.vercel.app
APP_URI=https://url-shortner-sand-seven.vercel.app/
JWT_SECRET=f5c6c51d0a309789ea4756f1d83f39fbc7618a2dba62e5e6aace60930c065107
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=malikbilal20553@gmail.com
SMTP_PASS=sqgp ugpw qnxu sbwr
FROM_EMAIL=malikbilal20553@gmail.com
```

## Frontend Environment Variables

Add these in Vercel Dashboard → `url-shortner-react-swart` → Settings → Environment Variables:

```bash
VITE_API_URL=https://url-shortner-sand-seven.vercel.app
```

## Quick Setup Steps

1. **Backend Deployment**:
   - Go to https://vercel.com/dashboard
   - Click `url-shortner-sand-seven`
   - Settings → Environment Variables
   - Add all backend variables above
   - Redeploy

2. **Frontend Deployment**:
   - Go to https://vercel.com/dashboard
   - Click `url-shortner-react-swart` 
   - Settings → Environment Variables
   - Add frontend variable above
   - Redeploy

3. **Auto-Deploy**:
   - After pushing to GitHub, both apps will auto-redeploy
   - Environment variables persist across deployments

## Your Live URLs

- **App**: https://url-shortner-react-swart.vercel.app/
- **API**: https://url-shortner-sand-seven.vercel.app/
- **Short URLs**: https://url-shortner-sand-seven.vercel.app/{code}
