import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utiles/error/error.js";
import { generateHash } from "../../../utiles/security/hash.js";
import { generateEncryption } from "../../../utiles/security/encryption.js";
import {emailEvent} from '../../../utiles/event/email.event.js'




export const signup = asyncHandler (async (req, res, next) => {
    try {
        const { username, email, password, confirmationPassword, phone } = req.body;
        console.log({ username, email, password, confirmationPassword });

        // Check if passwords match
        if (password !== confirmationPassword) {
            return res.status(400).json({ 
                message: "Password mismatch with confirmation password" 
            });
        }

        // Check if user already exists
        const checkUser = await userModel.findOne({ email });
        if (checkUser) {
            return res.status(409).json({ 
                message: "Email already exists" 
            });
        }

        // Hash password
        const hashPassword = generateHash({plaintext: password , salt:10})

        // Encrypt phone number
        const encryptPhone = generateEncryption({plaintext:phone})

        // Create user
        const user = await userModel.create({ 
            username, 
            email, 
            password: hashPassword, 
            phone: encryptPhone 
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.phone;
        emailEvent.emit("sendConfirmEmail" , {email})

        return res.status(201).json({ 
            message: "User created successfully. Please check your email to confirm your account.", 
            user: userResponse 
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Server Error", 
            error: error.message,
            stack: error.stack 
        });
    }
}
)


export const confirmEmail =asyncHandler (async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ 
                message: "Token is required" 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SIGNATURE);
        
        // Update user
        const user = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { confirmEmail: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        return res.status(200).json({ 
            message: "Email confirmed successfully. You can now login." 
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: "Confirmation link expired" 
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: "Invalid confirmation link" 
            });
        }
        
        return res.status(500).json({ 
            message: "Server Error", 
            error: error.message 
        });
    }
}
)

export const registrationService = asyncHandler (async (userData) => {
    const { userName, email, password } = userData;
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await userModel.create({
        userName,
        email,
        password: hashedPassword,
        role: 'User'
    });
    
    return user;
}
)


