# 🔄 Updated Production URLs - Configuration Guide

## New Production URLs
- **Frontend**: https://url-shortner-shahzad.vercel.app/
- **Backend**: https://usner.vercel.app/

## Environment Variables Updated

### Frontend (.env.production)
```bash
VITE_API_URL=https://usner.vercel.app
```

### Backend (.env.production)
```bash
MONGO_URI=mongodb+srv://admin-url-shortner:admin-url-shortner@clusterproject0.2pkm7ns.mongodb.net/url-shortner?retryWrites=true&w=majority
FRONTEND_URL=https://url-shortner-shahzad.vercel.app
APP_URI=https://usner.vercel.app/
JWT_SECRET=f5c6c51d0a309789ea4756f1d83f39fbc7618a2dba62e5e6aace60930c065107
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=malikbilal20553@gmail.com
SMTP_PASS=sqgp ugpw qnxu sbwr
FROM_EMAIL=malikbilal20553@gmail.com
```

## Important Notes

### For Vercel Deployment:
1. **Frontend Environment Variables** (Set in Vercel Dashboard):
   - `VITE_API_URL` = `https://usner.vercel.app`

2. **Backend Environment Variables** (Set in Vercel Dashboard):
   - `MONGO_URI` = `mongodb+srv://admin-url-shortner:admin-url-shortner@clusterproject0.2pkm7ns.mongodb.net/url-shortner?retryWrites=true&w=majority`
   - `FRONTEND_URL` = `https://url-shortner-shahzad.vercel.app`
   - `APP_URI` = `https://usner.vercel.app/`
   - `JWT_SECRET` = `f5c6c51d0a309789ea4756f1d83f39fbc7618a2dba62e5e6aace60930c065107`
   - `NODE_ENV` = `production`
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `malikbilal20553@gmail.com`
   - `SMTP_PASS` = `sqgp ugpw qnxu sbwr`
   - `FROM_EMAIL` = `malikbilal20553@gmail.com`

### CORS Configuration
The backend already supports the new frontend URL through the regex pattern `/\.vercel\.app$/` which allows all Vercel domains.

### Issues Fixed:
1. ✅ Updated frontend API URL to point to new backend
2. ✅ Updated backend FRONTEND_URL for CORS and email verification links
3. ✅ Updated backend APP_URI for generated short URLs
4. ✅ Maintained email service configuration

## Next Steps:
1. Commit and push these changes
2. Set environment variables in Vercel dashboard for both projects
3. Trigger redeploys for both frontend and backend
4. Test the production deployment

## Testing Checklist:
- [ ] Frontend loads at https://url-shortner-shahzad.vercel.app/
- [ ] Backend API responds at https://usner.vercel.app/debug/db
- [ ] User registration works with email verification
- [ ] Short URL creation works
- [ ] Short URL redirects work
- [ ] Dashboard shows user URLs correctly
- [ ] Copy functionality uses correct production URLs
