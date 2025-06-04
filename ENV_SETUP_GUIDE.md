# Environment Variables Guide

## 📁 **Environment Files Explained**

### **Why Multiple Environment Files?**

Different environments (development, production, testing) need different configurations:

| File | Purpose | Committed to Git? | When Used? |
|------|---------|-------------------|------------|
| `.env` | Default values for all environments | ❌ No | Fallback for any environment |
| `.env.local` | Personal local overrides | ❌ No | Your personal dev settings |
| `.env.development` | Development-specific values | ❌ No | When NODE_ENV=development |
| `.env.production` | Production-specific values | ❌ No | When NODE_ENV=production |
| `.env.*.example` | Templates for team members | ✅ Yes | Documentation/setup guide |

### **Loading Priority (highest to lowest):**
1. `.env.production.local` (production + local)
2. `.env.local` (always loaded except test)
3. `.env.production` (production environment)
4. `.env` (fallback)

## 🚀 **Setup Instructions**

### **For Development:**
1. Copy `.env.development.example` to `.env`
2. Fill in your actual values
3. Never commit the actual `.env` file

### **For Production (Vercel/Railway/etc.):**
1. Use `.env.production.example` as reference
2. Set environment variables in your hosting platform's dashboard
3. Never store production secrets in code

## 🔐 **Security Best Practices**

### **✅ DO:**
- Use strong, unique JWT secrets (32+ characters)
- Use different database names for dev/prod
- Use app passwords for Gmail SMTP
- Keep API keys secure and never commit them

### **❌ DON'T:**
- Commit any `.env` files to Git
- Use the same database for dev and production
- Share your `.env` files in chat/email
- Use weak JWT secrets in production

## 🛠 **Common Environment Variables**

### **Database:**
```bash
# Development
MONGO_URI=mongodb+srv://dev:pass@cluster.mongodb.net/urlshortner-dev

# Production  
MONGO_URI=mongodb+srv://prod:pass@cluster.mongodb.net/urlshortner-prod
```

### **URLs:**
```bash
# Development
FRONTEND_URL=http://localhost:5173
APP_URI=http://localhost:3000/

# Production
FRONTEND_URL=https://myapp.vercel.app
APP_URI=https://myapi.vercel.app/
```

### **Email:**
```bash
# Use Gmail App Passwords (not your regular password)
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd-efgh-ijkl-mnop  # 16-character app password
```

## 🔧 **Troubleshooting**

### **"Environment variable not found"**
1. Check if `.env` file exists in the correct directory
2. Verify variable names match exactly (case-sensitive)
3. Restart your development server
4. Check if `dotenv.config()` is called early in your app

### **"Database connection failed"**
1. Verify `MONGO_URI` is correct
2. Check if your IP is whitelisted in MongoDB Atlas
3. Ensure database user has proper permissions

### **"Email not sending"**
1. Use Gmail App Passwords, not regular passwords
2. Enable 2-factor authentication on Gmail
3. Check SMTP host and port settings
