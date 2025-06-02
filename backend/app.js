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
import { ensureDbConnection } from './src/middleware/database.middleware.js';

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

// Ensure database connection for all API routes
app.use('/api', ensureDbConnection);

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

// Favicon route - return 204 No Content
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

// Root route - 404 page with redirect to frontend
app.get('/', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - API Server</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .container {
                text-align: center;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                width: 90%;
            }
            .error-code {
                font-size: 6rem;
                font-weight: bold;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            .error-message {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                opacity: 0.9;
            }
            .description {
                font-size: 1rem;
                margin-bottom: 2rem;
                opacity: 0.8;
                line-height: 1.6;
            }
            .redirect-btn {
                display: inline-block;
                padding: 12px 24px;
                background: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            }
            .redirect-btn:hover {
                background: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
            }
            .api-info {
                margin-top: 2rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                font-size: 0.9rem;
                opacity: 0.7;
            }
            .countdown {
                margin-top: 1rem;
                font-size: 0.9rem;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error-code">404</div>
            <div class="error-message">API Server</div>
            <div class="description">
                This is the backend API server for the URL Shortener application.<br>
                You've reached the wrong place! 🤔
            </div>
            <a href="${frontendUrl}" class="redirect-btn">Go to URL Shortener App</a>
            <div class="countdown" id="countdown">
                Redirecting automatically in <span id="timer">10</span> seconds...
            </div>
            <div class="api-info">
                <strong>For developers:</strong><br>
                API endpoints are available at /api/*<br>
                Documentation: <a href="/api/docs" style="color: #87CEEB;">API Docs</a>
            </div>
        </div>

        <script>
            let timeLeft = 10;
            const timer = document.getElementById('timer');
            const countdown = document.getElementById('countdown');
            
            const countdownInterval = setInterval(() => {
                timeLeft--;
                timer.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    countdown.textContent = 'Redirecting now...';
                    window.location.href = '${frontendUrl}';
                }
            }, 1000);
            
            // Immediate redirect on button click
            document.querySelector('.redirect-btn').addEventListener('click', () => {
                clearInterval(countdownInterval);
            });
        </script>
    </body>
    </html>
  `);
});

//GET: Redirection
app.get('/:id', shortUrlRedirect)

//Error Handler
app.use(errorHandler)

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  try {
    await connectDB();
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
  }
})