# URL Shortener

A modern, full-stack URL shortener application with user authentication, email verification, and comprehensive form validation.

## Features

- 🔗 **URL Shortening**: Create short URLs from long ones
- 🎨 **Custom Short URLs**: Create custom branded short links  
- 👤 **User Authentication**: Register, login, and manage your URLs
- ✉️ **Email Verification**: Secure email verification for new accounts
- 🔒 **Form Validation**: Comprehensive email and password validation
- 👤 **Profile Management**: Update profile and change passwords
- 🔑 **Password Reset**: Forgot password functionality
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on all devices

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **bcrypt** - Password hashing

## Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB database
- Email service (Gmail/SMTP)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd URL-Shortner
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create `.env` file in backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=your-jwt-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:5173
   PORT=3000
   ```

5. **Start the application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Features Overview

### Authentication & Security
- JWT-based authentication
- Email verification for new accounts
- Password strength validation
- Secure password reset flow
- Protected routes

### URL Management
- Create short URLs from long URLs
- Custom short URL creation
- View all your shortened URLs
- Click tracking and analytics

### User Experience
- Responsive design for all devices
- Dark/light mode toggle
- Real-time form validation
- Loading states and error handling
- Success/error notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### URL Management
- `POST /api/short` - Create short URL
- `POST /api/custom` - Create custom short URL
- `GET /api/user/urls` - Get user URLs
- `GET /:shortId` - Redirect to original URL

## Deployment

### Backend Deployment (Vercel)
1. Configure `vercel.json` in backend directory
2. Set environment variables in Vercel dashboard
3. Deploy: `vercel --prod`

### Frontend Deployment (Vercel)
1. Configure `vercel.json` in frontend directory
2. Set build commands and environment variables
3. Deploy: `vercel --prod`

## Environment Variables

### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `EMAIL_USER` - Email service username
- `EMAIL_PASS` - Email service password
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Server port (default: 3000)

### Frontend
- `VITE_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.