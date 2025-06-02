import express from "express"
import { userRegister, userLogin, userLogout, getCurrentuser, verifyEmail, resendVerification } from "../controller/auth.controller.js"
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/logout', userLogout)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerification)
router.get('/me', authMiddleware, getCurrentuser)


export default router