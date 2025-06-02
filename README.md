# URL Shortener

A full-stack URL shortening service with user authentication, custom URLs, and analytics.

![URL Shortener](https://img.shields.io/badge/React-18.0+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-brightgreen.svg)

## Features

### Core Features
- ✅ **URL Shortening**: Convert long URLs into short, shareable links
- ✅ **Custom URLs**: Create branded short links with custom aliases (login required)
- ✅ **Click Tracking**: Monitor the number of clicks on your shortened URLs
- ✅ **User Authentication**: Secure JWT-based authentication system
- ✅ **User Dashboard**: Manage and view all your shortened URLs with statistics

### User Experience
- 🎯 **Guest Access**: Create short URLs without registration
- 🔐 **Protected Custom URLs**: Custom URL creation requires user login
- 📊 **Analytics Dashboard**: View click statistics for all your URLs
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized for speed and reliability

## Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4.1.8** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.15.1** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **Nanoid** - URL-safe unique ID generator
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd URL-Shortner
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/url-shortner
APP_URI=http://localhost:3000/
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

5. **Database Setup**
Ensure MongoDB is running on your system:
```bash
# Start MongoDB (varies by OS)
mongod
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:3000

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173 (or next available port)

3. **Access the Application**
Open your browser and navigate to the frontend URL displayed in the terminal.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/me` - Get current user

### URL Management
- `POST /api/create` - Create short URL (guests can use without custom ID)
- `POST /api/create/custom` - Create custom short URL (authentication required)
- `GET /:id` - Redirect to original URL
- `POST /api/user/urls` - Get user's URLs (authentication required)

## Usage

### For Guests (No Registration Required)
1. Visit the homepage
2. Enter a long URL in the form
3. Click "Convert to Short URL"
4. Copy and share your shortened URL

### For Registered Users
1. **Register/Login**: Create an account or sign in
2. **Create Custom URLs**: Use the custom ID field to create branded links
3. **Dashboard Access**: View all your URLs and click statistics
4. **Track Performance**: Monitor how many clicks each URL receives

### Key User Flows

**Guest User wanting Custom URL:**
1. Guest enters URL and custom ID
2. System prompts to login
3. User is redirected to login page
4. After login, user can create custom URLs

**Registered User Dashboard:**
1. Login to access dashboard
2. View all created URLs with statistics
3. Create new URLs with custom IDs
4. Copy URLs for sharing
5. Track click performance

## Project Structure

```
URL-Shortner/
├── README.md
├── backend/
│   ├── app.js                 # Express app entry point
│   ├── package.json
│   └── src/
│       ├── config/            # Configuration files
│       ├── controller/        # Route controllers
│       ├── dao/              # Data access objects
│       ├── middleware/        # Custom middleware
│       ├── models/           # Mongoose models
│       ├── routes/           # API routes
│       ├── services/         # Business logic
│       └── utils/            # Utility functions
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx           # Main app component
        ├── main.jsx          # App entry point
        ├── api/              # API service functions
        ├── components/       # Reusable components
        ├── contexts/         # React contexts
        ├── pages/           # Page components
        └── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**