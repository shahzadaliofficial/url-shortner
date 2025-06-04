# URL Shortener

A modern, full-stack URL shortening service built with React, Node.js, Express, and MongoDB. Features real-time email validation using Abstract API, user authentication, custom short URLs, and comprehensive URL analytics.

## 🚀 Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short URLs**: Authenticated users can create custom short link IDs
- **Click Analytics**: Track clicks, timestamps, and referrer data
- **URL Management**: View, edit, and delete your shortened URLs

### Authentication & Security
- **User Registration & Login**: Secure account creation with email verification
- **Real-time Email Validation**: Advanced email verification using Abstract API
- **Educational Domain Support**: Special handling for educational institutions (.edu, .edu.pk, .ac.uk)
- **Password Reset**: Secure password recovery via email
- **JWT Authentication**: Token-based authentication system

### User Experience
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Validation**: Instant feedback on forms and inputs
- **Loading States**: Smooth loading indicators throughout the app

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email sending service

### External Services
- **Abstract API** - Email validation and deliverability checking
- **MongoDB Atlas** - Cloud database hosting
- **Gmail SMTP** - Email delivery service

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation
- Abstract API key for email validation
- Gmail account for SMTP (or other email service)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd URL-Shortner
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/url-shortner?retryWrites=true&w=majority

# Application URLs
FRONTEND_URL=http://localhost:5173
APP_URI=http://localhost:3000/

# JWT Security
JWT_SECRET=your-very-secure-jwt-secret-key

# Environment
NODE_ENV=development

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Abstract API Email Validation
ABSTRACT_API_KEY=your-abstract-api-key
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start Development Servers

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🔑 API Keys Setup

### Abstract API (Email Validation)
1. Visit [Abstract API](https://www.abstractapi.com/api/email-validation-api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file as `ABSTRACT_API_KEY`

### Gmail SMTP Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in your `.env` file as `SMTP_PASS`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/validate-email` - Real-time email validation
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### URL Management
- `POST /api/shorten` - Create short URL
- `GET /api/urls` - Get user's URLs (authenticated)
- `GET /api/urls/:id/analytics` - Get URL analytics
- `DELETE /api/urls/:id` - Delete URL
- `GET /:shortId` - Redirect to original URL

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🎨 Key Features Explained

### Real-time Email Validation
The application uses Abstract API to validate email addresses in real-time as users type:

- **Format Validation**: Basic regex pattern matching
- **Deliverability Check**: Verifies if email can actually receive messages
- **Educational Domain Support**: Special handling for university emails
- **Autocorrect Disabled**: Prevents false negatives from domain suggestions

### Custom Short URLs
Authenticated users can create custom short URL identifiers:
- Pattern validation (letters, numbers, hyphens, underscores)
- Uniqueness checking
- Fallback to auto-generated IDs if custom ID is taken

### Click Analytics
Comprehensive tracking of URL usage:
- Total click count
- Click timestamps
- Referrer information
- Geographic data (if implemented)

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **Email Verification**: Required for account activation
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against abuse (can be added)
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Login to Vercel CLI**:
   ```bash
   npx vercel login
   ```

2. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

### Manual Deployment

#### Backend Deployment

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Deploy to Vercel:
   ```bash
   npx vercel --prod
   ```

3. Set environment variables in Vercel dashboard or via CLI:
   ```bash
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   vercel env add FRONTEND_URL
   vercel env add ABSTRACT_API_KEY
   # ... add other environment variables
   ```

#### Frontend Deployment

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Update `VITE_API_URL` in `.env.production` with your backend URL

3. Deploy to Vercel:
   ```bash
   npx vercel --prod
   ```

### Environment Variables Setup

Create production environment files:

**Backend** (`.env.production`):
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
ABSTRACT_API_KEY=your_abstract_api_key
# ... other variables
```

**Frontend** (`.env.production`):
```env
VITE_API_URL=https://your-backend-domain.vercel.app
```

### Troubleshooting Deployment

- **Database Connection Issues**: Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0) for serverless functions
- **CORS Errors**: Update backend CORS configuration with your frontend domain
- **Environment Variables**: Verify all required environment variables are set in Vercel dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Educational domain validation may need fine-tuning for specific institutions
- Rate limiting not implemented (recommended for production)
- Geographic analytics not implemented

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Abstract API](https://www.abstractapi.com/) for email validation services
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [React](https://reactjs.org/) team for the amazing frontend library
- [Express.js](https://expressjs.com/) for the backend framework
