import User from '../models/user.model.js'
import shortUrlModel from '../models/shorturl.model.js'

export const findUserByEmail=async(email, token = null)=>{
    if (token) {
        return await User.findOne({emailVerificationToken: token})
    }
    return await User.findOne({email})      
}

export const findUserById=async(id)=>{
        return await User.findById(id)      
}

export const createUser=async(name, email, password, verificationToken = null, verificationExpires = null)=>{
        const newUser = new User({
            name, 
            email, 
            password,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false
        })
        await newUser.save()
        return newUser      
}

export const updateUserVerification = async (userId, verificationToken = null, verificationExpires = null, isVerified = true) => {
    const updateData = {
        isEmailVerified: isVerified
    }
    
    if (isVerified) {
        // Clear verification fields when verifying
        updateData.emailVerificationToken = null
        updateData.emailVerificationExpires = null
    } else {
        // Update verification fields when resending
        updateData.emailVerificationToken = verificationToken
        updateData.emailVerificationExpires = verificationExpires
    }
    
    return await User.findByIdAndUpdate(userId, updateData, { new: true })
}
export const getAllUserUrlsDao = async (id) => {
    return await shortUrlModel.find({user:id})
}

export const updateUserProfile = async (userId, name, email) => {
    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    
    return await User.findByIdAndUpdate(userId, updateData, { new: true })
}

export const updateUserPassword = async (userId, hashedPassword) => {
    return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true })
}

export const updateUserPasswordResetToken = async (userId, resetToken, resetExpires) => {
    return await User.findByIdAndUpdate(userId, { 
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires 
    }, { new: true })
}

export const findUserByPasswordResetToken = async (token) => {
    return await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
    })
}

export const clearPasswordResetToken = async (userId) => {
    return await User.findByIdAndUpdate(userId, {
        passwordResetToken: null,
        passwordResetExpires: null
    }, { new: true })
}