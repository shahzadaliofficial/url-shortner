import express from 'express';
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import connectDB from './src/config/mongo.config.js';
import shortUrlRouter from './src/routes/shortUrl.route.js';
import authRouter from  './src/routes/auth.route.js';
import userRouter from "./src/routes/user.route.js"
import { shortUrlRedirect } from './src/controller/shortUrl.controller.js';
import { errorHandler } from './src/utils/errorHandler.js';
import cors from 'cors'
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser"

dotenv.config()

// Debug environment variables
console.log('=== Environment Check ===')
console.log('MONGO_URI:', process.env.MONGO_URI ? 'LOADED' : 'MISSING')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? 'LOADED' : 'MISSING')
console.log('========================')

const app =express();
app.set('case sensitive routing', true);
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:5175', 
        'http://localhost:5176',
        process.env.FRONTEND_URL, // Add production frontend URL
        /\.vercel\.app$/ // Allow all Vercel apps for flexibility
    ].filter(Boolean), // Remove undefined values
    credentials: true // 👈 this allows cookies to be sent
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.use(attachUser)

// Debug endpoint to test MongoDB connection
app.get('/debug/db', async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState === 1) {
      res.json({ 
        status: 'success', 
        message: 'Database connected successfully',
        readyState: mongoose.default.connection.readyState 
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Database not connected',
        readyState: mongoose.default.connection.readyState 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

app.use("/api/user", userRouter)

//POST: Create URL
app.use("/api/create",shortUrlRouter)

//Auth
app.use("/api/auth",authRouter)
//GET: Redirection
app.get('/:id', shortUrlRedirect)

//Error Handler
app.use(errorHandler)

app.listen(3000, () => {
  connectDB()
  console.log('Server is running on port 3000');
})