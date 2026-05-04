import mongoose, { model , Schema } from "mongoose";
import { userRoles } from "../../middleware/auth.middleware.js";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    changePasswordTime : Date,
}, { 
    timestamps: true 
});


const userModel =mongoose.models.User || model ("User", userSchema)
export default userModel