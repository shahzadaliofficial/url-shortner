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

dotenv.config('./.env')


const app =express();
app.use(cors({
    origin: 'http://localhost:5173', // your React app
    credentials: true // 👈 this allows cookies to be sent
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.use(attachUser)

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