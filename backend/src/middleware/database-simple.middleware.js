import mongoose from 'mongoose';
import connectDB from '../config/mongo.config.js';

// Simple but robust database connection middleware
export const ensureDbConnection = async (req, res, next) => {
  try {
    // If already connected, continue
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    console.log(`🔌 Database connection needed. Current state: ${mongoose.connection.readyState}`);
    
    // Always attempt to connect if not connected
    await connectDB();
    
    // Wait for connection to be established
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    while (mongoose.connection.readyState !== 1 && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database connection timeout. Final state: ${mongoose.connection.readyState}`);
    }
    
    console.log('✅ Database connected successfully');
    next();
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable'
    });
  }
};
