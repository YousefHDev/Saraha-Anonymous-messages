import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../../utiles/error/error.js";

        

export const getProfile =asyncHandler (async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Find user by ID from the authenticated user
        const user = await userModel.findById(req.user._id)
            .select("-password -__v") // Exclude sensitive fields
            .lean(); // Convert to plain JavaScript object

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Return user profile
        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                user
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
)

export const getUserById = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // ✅ SAFE: Check if ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find user by ID
        const user = await userModel.findById(id)
            .select("-password -__v -email") // Exclude private fields
            .lean();

        // ✅ SAFE: Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found",
            data: { user }
        });

    } catch (error) {
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}
)

export const updateProfile = asyncHandler(async (req, res, next) => {
    try {
        // Prevent updating sensitive fields
        const allowedUpdates = ['username', 'phone', 'address', 'DOB', 'gender'];
        const updateData = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields to update"
            });
        }

        // Update user
        const user = await userModel.findByIdAndUpdate(
            req.user._id, 
            updateData, 
            { new: true, runValidators: true }
        ).select("-password -email -__v");

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        return successResponse({ 
            res, 
            message: "Profile updated successfully",
            data: { user } 
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { password, oldPassword } = req.body;

    // Check if passwords are provided
    if (!oldPassword || !password) {
        return next(new Error("Old password and new password are required", { cause: 400 }));
    }

    // Verify old password
    if (!compareHash({ plaintext: oldPassword, hashValue: req.user.password })) {
        return next(new Error("Invalid old password", { cause: 409 }));
    }

    // Hash new password
    const hashPassword = generateHash({ plaintext: password });

    // Update user password
    const user = await userModel.findByIdAndUpdate(
        req.user._id, 
        { password: hashPassword }, 
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    return successResponse({ 
        res, 
        message: "Password updated successfully",
        data: { user } 
    });
});

export const freezeProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
        req.user._id, 
        { 
            isDeleted: true,
            deletedAt: Date.now(),
            deletedBy: req.user._id
        }, 
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        return res.status(404).json({ 
            success: false,
            message: "User not found" 
        });
    }

    return successResponse({ 
        res, 
        message: "Profile frozen successfully",
        data: { user } 
    });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ 
        _id: req.params.userId, 
        isDeleted: false 
    }).select("-password -__v");

    return user 
        ? successResponse({ 
            res, 
            message: "Profile retrieved successfully",
            data: { user } 
        }) 
        : next(new Error("Invalid account ID", { cause: 404 }));
});