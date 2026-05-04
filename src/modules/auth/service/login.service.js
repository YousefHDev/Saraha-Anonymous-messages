import userModel from "../../../DB/model/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { asyncHandler } from "../../../utiles/error/error.js"; 

export const loginService =asyncHandler (async (email, password) => {
    // Find user by email
    const user = await userModel.findOne({ email });
    
    if (!user) {
        throw new Error("Invalid credentials");
    }
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    
   
}
)
export const login = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.TOKEN_SIGNATURE,
            { expiresIn: '7d' }
        );

        // 4. Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.username,
                    email: user.email
                },
                token
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});