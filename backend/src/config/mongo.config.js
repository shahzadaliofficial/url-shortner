import mongoose from "mongoose";

const connectDB = async () => {
 try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
     
}catch(error){
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1)
    
}
}

export default connectDB