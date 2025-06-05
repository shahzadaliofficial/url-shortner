import mongoose from 'mongoose';
import connectDB from '../config/mongo.config.js';

export const ensureDbConnection = async (req, res, next) => {
  try {
    // Check if database is connected
    const currentState = mongoose.connection.readyState;
    console.log(`🔍 Database connection state: ${currentState} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
    
    if (currentState === 1) {
      // Already connected
      return next();
    }
    
    if (currentState === 2) {
      // Currently connecting, wait for it
      console.log('Database is connecting, waiting...');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 15000);
        
        const checkConnection = () => {
          if (mongoose.connection.readyState === 1) {
            clearTimeout(timeout);
            resolve();
          } else if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
            clearTimeout(timeout);
            reject(new Error('Connection failed during wait'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        
        checkConnection();
      });
      
      return next();
    }
    
    // Not connected (state 0 or 3), attempt to connect
    console.log('Database not connected, attempting to connect...');
    
    // Set a timeout for connection attempt
    const connectionPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout after 20 seconds')), 20000)
    );
    
    await Promise.race([connectionPromise, timeoutPromise]);
    
    // Final check
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database connection failed. Final state: ${mongoose.connection.readyState}`);
    }
    
    console.log('✅ Database connection established successfully');
    next();
  } catch (error) {
    console.error('❌ Database connection middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? {
        connectionState: mongoose.connection.readyState,
        mongoUri: process.env.MONGO_URI ? 'Set' : 'Missing'
      } : undefined
    });
  }
};
