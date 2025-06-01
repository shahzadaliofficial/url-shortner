import { findUserById } from "../dao/user.dao.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { verifyJwtToken } from "../utils/helper.utils.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        const decoded = verifyJwtToken(token);
        
        if (!decoded) {
            throw new UnauthorizedError("Invalid token");
        }

        const user = await findUserById(decoded.id);
        
        if (!user) {
            throw new UnauthorizedError("User not found");
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        // If it's already an UnauthorizedError, pass it through
        if (error instanceof UnauthorizedError) {
            throw error;
        }
        // For other errors (JWT verification, etc), throw a new UnauthorizedError
        throw new UnauthorizedError("Authentication failed");
    }
};