import mongoose from "mongoose";

// Global MongoDB connection for serverless
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
    console.log('Environment:', process.env.NODE_ENV);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    // Serverless-optimized configuration for Vercel
    mongoose.set('bufferCommands', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection timeouts
      serverSelectionTimeoutMS: 5000, // 5 seconds for serverless
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      
      // Buffer settings for serverless
      bufferCommands: false,
      
      // Connection pool settings
      maxPoolSize: 5, // Lower for serverless
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Compression
      compressors: 'zlib'
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Ready State: ${conn.connection.readyState}`);
    
    // Cache the connection
    cachedConnection = conn;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedConnection = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null;
    });
    
    return conn;
     
  } catch(error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    
    // In serverless, don't exit process, just throw error
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      process.exit(1);
    }
  }
}

export default connectDB