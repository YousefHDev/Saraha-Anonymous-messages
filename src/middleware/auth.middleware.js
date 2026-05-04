import jwt from "jsonwebtoken";
import userModel from "../DB/model/User.model.js";

export const userRoles = {
    user: "User",
    admin: "Admin"
};

export const authentication = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            
            // Check if authorization header exists
            if (!authorization) {
                return res.status(401).json({ 
                    success: false,
                    message: "Authorization token required" 
                });
            }

            // Extract token (remove 'Bearer ' prefix if present)
            const token = authorization.startsWith('Bearer ') 
                ? authorization.split(' ')[1] 
                : authorization;

            // Validate token format (JWT tokens have 3 parts separated by dots)
            if (!token || token.split('.').length !== 3) {
                return res.status(401).json({ 
                    success: false,
                    message: "Invalid token format" 
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);
            
            // Get user ID from token
            const userId = decoded.id || decoded._id || decoded.userId;
            
            if (!userId) {
                return res.status(401).json({ 
                    success: false,
                    message: "Invalid token payload" 
                });
            }

            // Find user
            const user = await userModel.findById(userId).select("-password");
            
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: "User not found" 
                });
            }

            if (user.isDeleted) {
                return res.status(401).json({ 
                    success: false,
                    message: "Account has been deleted" 
                });
            }

            // Attach user to request
            req.user = user;
            next();
            
        } catch (error) {
            // Handle specific JWT errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    success: false,
                    message: "Invalid token" 
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    message: "Token expired" 
                });
            }
            
            return res.status(500).json({ 
                success: false,
                message: "Authentication failed",
                error: error.message 
            });
        }
    };
};