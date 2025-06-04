import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import net from 'net'
import connectDB  from './src/config/mongo.config.js'
import { errorHandler } from './src/utils/errorHandler.js'

// Route imports
import authRoutes from './src/routes/auth.route.js'
import shortUrlRoutes from './src/routes/shortUrl.route.js'
import userRoutes from './src/routes/user.route.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Function to check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
};

// Function to find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  while (port < startPort + 10) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error(`No available ports found between ${startPort} and ${startPort + 9}`);
};

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// Health check route
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

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    
    // Find an available port
    const availablePort = await findAvailablePort(PORT);
    if (availablePort !== PORT) {
      console.log(`⚠️  Port ${PORT} is busy, using port ${availablePort} instead`);
    }
    
    // Start server only after successful DB connection
    const server = app.listen(availablePort, () => {
      console.log(`🚀 Server is running on port ${availablePort}`)
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
      console.log(`🌐 API Health: http://localhost:${availablePort}/health`)
    });
    
    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

// Error handling middleware
app.use(errorHandler)

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Start the application
startServer();

export default app