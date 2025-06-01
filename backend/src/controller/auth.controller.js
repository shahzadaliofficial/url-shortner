import { cookieOptions } from "../config/config.js"
import { loginUserService, registerUserService } from "../services/auth.service.js"
import tryCatchWrapAsync from "../utils/tryCatchWrapper.js"

export const userRegister = tryCatchWrapAsync(async (req,res)=>{
    const {name, email, password}=req.body  
    
    const token= await registerUserService(name, email.toLowerCase(), password)
    req.user=user
    res.cookie("accessToken", token, cookieOptions)
    res.status(200).json({message: "Register and Login Success"})
    
})

export const userLogin =  tryCatchWrapAsync(async (req,res)=>{
    const { email, password}=req.body  
    const token= await loginUserService(email.toLowerCase(), password)
    req.user=user
    res.cookie("accessToken", token, cookieOptions)
    res.status(200).json({message: "Login Success"})

})
export const userLogout =  tryCatchWrapAsync(async (req,res)=>{
    res.clearCookie("accessToken", cookieOptions)
    res.status(200).json({message:"logout success"})

})

export const getCurrentuser =  tryCatchWrapAsync(async (req,res)=>{
    res.status(200).json({user:req.user})

})


