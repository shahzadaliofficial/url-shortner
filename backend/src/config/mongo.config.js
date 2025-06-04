import mongoose from "mongoose";

// Global connection variable for serverless
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if available and connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  // If connection exists but not ready, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB connection is in connecting state, waiting...');
    await new Promise((resolve) => {
      mongoose.connection.on('connected', resolve);
      setTimeout(resolve, 10000); // Timeout after 10 seconds
    });
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
    console.log('Environment:', process.env.NODE_ENV);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // Serverless optimized configuration with increased timeouts
    const connectionOptions = {
      serverSelectionTimeoutMS: 30000, // Increased from 5000
      connectTimeoutMS: 30000,          // Increased from 10000
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
      readPreference: 'primaryPreferred', // Allow reading from secondaries if primary is down
    };
    
    console.log('Connecting with options:', JSON.stringify(connectionOptions, null, 2));
    
    const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
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
      console.warn('MongoDB disconnected');
      cachedConnection = null;
    });
    
    return conn;
     
  } catch(error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Reset cached connection on error
    cachedConnection = null;
    
    // Don't throw error in development to allow server to start
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  MongoDB connection failed in development mode. Server will start but database operations will fail.');
      console.warn('⚠️  This is likely a temporary Atlas connectivity issue. Try restarting the server.');
      return null;
    }
    
    throw error;
  }
}

export default connectDB
