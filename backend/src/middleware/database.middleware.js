import mongoose from 'mongoose';
import connectDB from '../config/mongo.config.js';

export const ensureDbConnection = async (req, res, next) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting to connect...');
      
      // Set a timeout for connection attempt
      const connectionPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 15000)
      );
      
      await Promise.race([connectionPromise, timeoutPromise]);
      
      // Double-check connection state
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection failed after attempt');
      }
    }
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
