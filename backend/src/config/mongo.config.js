import mongoose from "mongoose";

// Global connection variable for serverless
let cachedConnection = null;
let isConnecting = false;

const connectDB = async () => {
  // If already connecting, wait for it
  if (isConnecting) {
    console.log('Connection attempt already in progress, waiting...');
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  // Return cached connection if available and connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  // If connection exists but not ready, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB connection is in connecting state, waiting...');
    await new Promise((resolve) => {
      const checkConnection = () => {
        if (mongoose.connection.readyState === 1) {
          resolve();
        } else if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
          resolve(); // Let it try to reconnect
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
      setTimeout(resolve, 15000); // Timeout after 15 seconds
    });
    
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  isConnecting = true;

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
      bufferCommands: false,            // Important for serverless
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
      readPreference: 'primaryPreferred', // Allow reading from secondaries if primary is down
    };
    
    console.log('Connecting with options:', JSON.stringify(connectionOptions, null, 2));
    
    // Clear any existing connection state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Ready State: ${conn.connection.readyState}`);
    
    // Cache the connection
    cachedConnection = conn;
    isConnecting = false;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedConnection = null;
      isConnecting = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      cachedConnection = null;
      isConnecting = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      cachedConnection = mongoose.connection;
    });
    
    return conn;
     
  } catch(error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Reset cached connection on error
    cachedConnection = null;
    isConnecting = false;
    
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
