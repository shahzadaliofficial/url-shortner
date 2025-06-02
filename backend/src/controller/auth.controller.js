import { cookieOptions } from "../config/config.js"
import { loginUserService, registerUserService, verifyEmailService, resendVerificationService } from "../services/auth.service.js"
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
    const token= await loginUserService(email.toLowerCase(), password)
    res.cookie("accessToken", token, cookieOptions)
    res.status(200).json({message: "Login Success"})
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


