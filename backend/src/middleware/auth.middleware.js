import { findUserById } from "../dao/user.dao.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { verifyJwtToken } from "../utils/helper.utils.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = verifyJwtToken(token);
        
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        const user = await findUserById(decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};