import { cookieOptions } from "../config/config.js"
import { loginUserService, registerUserService, verifyEmailService, resendVerificationService, updateProfileService, changePasswordService, forgotPasswordService, resetPasswordService } from "../services/auth.service.js"
import tryCatchWrapAsync from "../utils/tryCatchWrapper.js"

export const userRegister = tryCatchWrapAsync(async (req,res)=>{
    const {name, email, password}=req.body  
    
    const result = await registerUserService(name, email.toLowerCase(), password)
    
    if (result.requiresVerification) {
        res.status(201).json({
            message: "Registration successful! Please check your email to verify your account.",
            user: result.user,
            requiresVerification: true
        })
    } else {
        // Fallback for if verification is disabled
        res.cookie("accessToken", result.token, cookieOptions)
        res.status(200).json({message: "Register and Login Success"})
    }
})

export const userLogin =  tryCatchWrapAsync(async (req,res)=>{
    const { email, password}=req.body  
    const result = await loginUserService(email.toLowerCase(), password)
    res.cookie("accessToken", result.token, cookieOptions)
    
    const response = {
        message: "Login Success",
        user: result.user
    };
    
    res.status(200).json(response);
})

export const verifyEmail = tryCatchWrapAsync(async (req, res) => {
    const { token } = req.body
    
    const result = await verifyEmailService(token)
    
    res.cookie("accessToken", result.token, cookieOptions)
    res.status(200).json({
        message: "Email verified successfully! Welcome to URL Shortener!",
        user: result.user
    })
})

export const resendVerification = tryCatchWrapAsync(async (req, res) => {
    const { email } = req.body
    
    const result = await resendVerificationService(email.toLowerCase())
    
    res.status(200).json(result)
})

export const userLogout =  tryCatchWrapAsync(async (req,res)=>{
    res.clearCookie("accessToken", cookieOptions)
    res.status(200).json({message:"logout success"})
})

export const getCurrentuser =  tryCatchWrapAsync(async (req,res)=>{
    res.status(200).json({user:req.user})
})

export const updateProfile = tryCatchWrapAsync(async (req, res) => {
    const { name, email } = req.body
    const userId = req.user._id
    
    const result = await updateProfileService(userId, name, email?.toLowerCase())
    
    res.status(200).json({
        message: "Profile updated successfully",
        user: result.user
    })
})

export const changePassword = tryCatchWrapAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const userId = req.user._id
    
    await changePasswordService(userId, currentPassword, newPassword)
    
    res.status(200).json({
        message: "Password changed successfully"
    })
})

export const forgotPassword = tryCatchWrapAsync(async (req, res) => {
    const { email } = req.body
    
    await forgotPasswordService(email.toLowerCase())
    
    res.status(200).json({
        message: "If an account with this email exists, you will receive a password reset link."
    })
})

export const resetPassword = tryCatchWrapAsync(async (req, res) => {
    const { token, newPassword } = req.body
    
    const result = await resetPasswordService(token, newPassword)
    
    // Auto-login after password reset
    res.cookie("accessToken", result.token, cookieOptions)
    res.status(200).json({
        message: "Password reset successfully! You are now logged in.",
        user: result.user
    })
})

export const validateEmail = tryCatchWrapAsync(async (req, res) => {
    const { email } = req.body
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        })
    }
    
    const normalizedEmail = email.toLowerCase()
    const { validateEmailDeliverability } = await import('../utils/emailValidator.js')
    
    // Validate email deliverability
    const emailValidation = await validateEmailDeliverability(normalizedEmail)
    
    res.status(200).json({
        success: emailValidation.isValid,
        message: emailValidation.isValid ? 'Email is valid and deliverable' : emailValidation.error,
        isValid: emailValidation.isValid,
        details: emailValidation
    })
})


