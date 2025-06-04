import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './src/config/mongo.config.js'
import { errorHandler } from './src/utils/errorHandler.js'

// Route imports
import authRoutes from './src/routes/auth.route.js'
import shortUrlRoutes from './src/routes/shortUrl.route.js'
import userRoutes from './src/routes/user.route.js'

// Load environment variables
dotenv.config()

const app = express()

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

// Connect to database on startup
connectDB().catch(console.error);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'URL Shortener API is running successfully',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      shortUrl: '/api',
      user: '/api/user'
    }
  })
})

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'URL Shortener API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api', shortUrlRoutes)
app.use('/api/user', userRoutes)

// Error handling middleware
app.use(errorHandler)

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Export for Vercel
export default app
