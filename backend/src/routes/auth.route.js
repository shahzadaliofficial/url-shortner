import express from "express"
import { userRegister, userLogin, userLogout, getCurrentuser, verifyEmail, resendVerification, updateProfile, changePassword, forgotPassword, resetPassword } from "../controller/auth.controller.js"
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/logout', userLogout)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerification)
router.get('/me', authMiddleware, getCurrentuser)

// Profile management routes
router.put('/profile', authMiddleware, updateProfile)
router.put('/change-password', authMiddleware, changePassword)

// Password reset routes
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)


export default router