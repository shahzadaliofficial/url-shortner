import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortner';

async function cleanupTestUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete test users
    const result = await User.deleteMany({
      email: { $in: ['test@example.com', 'emailtest@example.com'] }
    });
    
    console.log(`Deleted ${result.deletedCount} test user(s)`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupTestUser();
