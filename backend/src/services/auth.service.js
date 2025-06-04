
import { createUser,findUserByEmail, updateUserVerification } from '../dao/user.dao.js'
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errorHandler.js';
import { signJwtToken } from '../utils/helper.utils.js';
import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } from './email.service.js';
import bcrypt from 'bcrypt';


export const registerUserService = async (name, email, password)=>{
    const user = await findUserByEmail(email)
    if (user) throw new ConflictError("User Already Exist");
    
    // Hash password before storing
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    const newUser = await createUser(name, email, hashedPassword, verificationToken, verificationExpires)
    
    // Send verification email
    await sendVerificationEmail(email, name, verificationToken)
    
    // Return user info without token (user needs to verify email first)
    return {
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isEmailVerified: newUser.isEmailVerified
        },
        requiresVerification: true
    }
}

export const loginUserService = async (email, password)=>{
    const user = await findUserByEmail(email)
    
    if (!user) {
        throw new NotFoundError("Email or password is invalid");
    }
    
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new NotFoundError("Email or password is invalid");
    }
    
    if (!user.isEmailVerified) {
        throw new UnauthorizedError("Please verify your email address before logging in");
    }
    
    const token=signJwtToken({id: user._id})
    
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified
        }
    }
}

export const verifyEmailService = async (token) => {
    const user = await findUserByEmail(null, token) // Modified to find by token
    
    if (!user || !user.emailVerificationToken || user.emailVerificationToken !== token) {
        throw new NotFoundError("Invalid verification token");
    }
    
    if (user.emailVerificationExpires < new Date()) {
        throw new UnauthorizedError("Verification token has expired");
    }
    
    if (user.isEmailVerified) {
        throw new ConflictError("Email is already verified");
    }
    
    // Update user as verified
    await updateUserVerification(user._id)
    
    // Send welcome email
    await sendWelcomeEmail(user.email, user.name)
    
    // Generate login token
    const loginToken = signJwtToken({id: user._id})
    
    return {
        token: loginToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isEmailVerified: true
        }
    }
}

export const resendVerificationService = async (email) => {
    const user = await findUserByEmail(email)
    
    if (!user) throw new NotFoundError("User not found");
    
    if (user.isEmailVerified) {
        throw new ConflictError("Email is already verified");
    }
    
    // Generate new verification token
    const verificationToken = generateVerificationToken()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    
    // Update user with new token
    await updateUserVerification(user._id, verificationToken, verificationExpires, false)
    
    // Send new verification email
    await sendVerificationEmail(email, user.name, verificationToken)
    
    return { message: "Verification email sent successfully" }
}