# Vercel Environment Variables Setup Guide

## Frontend Environment Variables (Required for Production)

### Via Vercel Dashboard:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

**Variable Name**: `VITE_API_URL`
**Value**: `https://url-shortner-sand-seven.vercel.app`
**Environment**: Production, Preview, Development

**Variable Name**: `VITE_FRONTEND_URL`  
**Value**: `https://url-shortner-react-swart.vercel.app`
**Environment**: Production, Preview, Development

### Via Vercel CLI:
```bash
# Set API URL
vercel env add VITE_API_URL production
# Enter: https://url-shortner-sand-seven.vercel.app

# Set Frontend URL
vercel env add VITE_FRONTEND_URL production  
# Enter: https://url-shortner-react-swart.vercel.app
```

### Verification:
After setting environment variables, redeploy your application:
```bash
vercel --prod
```

## Backend Environment Variables (Already Set)

**Variable Name**: `MONGODB_URI`
**Value**: `mongodb+srv://admin-url-shortner:admin-url-shortner@clusterproject0.2pkm7ns.mongodb.net/url-shortner?retryWrites=true&w=majority`

**Variable Name**: `NODE_ENV`
**Value**: `production`

**Variable Name**: `JWT_SECRET`
**Value**: `your-jwt-secret`

## Important Notes:

1. **Environment Variable Naming**: Vite requires environment variables to start with `VITE_` to be accessible in the frontend
2. **Vercel Deployment**: Environment variables set in Vercel dashboard override local .env files
3. **URL Format**: Ensure URLs don't have trailing slashes in environment variables
4. **Redeployment**: Changes to environment variables require a new deployment to take effect

## Troubleshooting:

If you still see localhost URLs in production:
1. Verify environment variables are set in Vercel dashboard
2. Check the deployment logs for any errors
3. Ensure the variable names match exactly (case-sensitive)
4. Redeploy after setting variables

## Files Updated:
- `frontend/vercel.json` - Vercel configuration with environment variables
- `frontend/vite.config.js` - Enhanced environment variable handling
- `frontend/src/pages/HomePage.jsx` - Production fallback URLs
- `frontend/src/pages/Dashboard.jsx` - Production fallback URLs  
- `frontend/src/components/UrlShortnerForm.jsx` - Production fallback URLs
