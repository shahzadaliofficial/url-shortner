import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    // Set a short timeout for testing
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('✅ Database:', conn.connection.name);
    console.log('✅ Ready State:', conn.connection.readyState);
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

testConnection();
