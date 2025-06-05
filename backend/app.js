import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB  from './src/config/mongo.config.js'
import { errorHandler } from './src/utils/errorHandler.js'
import { ensureDbConnection } from './src/middleware/database-simple.middleware.js'

// Route imports
import authRoutes from './src/routes/auth.route.js'
import shortUrlRoutes from './src/routes/shortUrl.route.js'
import userRoutes from './src/routes/user.route.js'
import { shortUrlRedirect } from './src/controller/shortUrl.controller.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://url-shortner-shahzad.vercel.app',
      'https://urner.vercel.app', // Updated backend URL
      // Add more Vercel URLs as needed
    ].filter(Boolean); // Remove undefined values
    
    console.log(`🌐 CORS Check - Origin: ${origin}, Allowed: ${allowedOrigins.includes(origin)}`);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// Connect to MongoDB in all environments
connectDB().catch(console.error);

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Root route
app.get('/', (req, res) => {
    res.status(404).redirect(`${frontendUrl}/`);
    
})

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'URL Shortener API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes with database middleware
app.use('/api/auth', ensureDbConnection, authRoutes)
app.use('/api', ensureDbConnection, shortUrlRoutes)
app.use('/api/user', ensureDbConnection, userRoutes)

// Short URL redirect route (must be after API routes but before 404 handler)
app.get('/:id', ensureDbConnection, shortUrlRedirect)

// Error handling middleware
app.use(errorHandler)

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).redirect(`${frontendUrl}/404`);
})

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
    console.log(`🌐 API Health: http://localhost:${PORT}/health`)
  })
}

export default app