import express from "express"
import { userRegister, userLogin, userLogout, getCurrentuser } from "../controller/auth.controller.js"
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/logout', userLogout)
router.post('/me', authMiddleware, getCurrentuser)


export default router