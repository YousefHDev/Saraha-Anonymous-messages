import mongoose from "mongoose";
import { Schema, Types, model } from "mongoose";

const messageSchema = new Schema({
    message: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 50000, 
        trim: true 
    },
    recipientId: { 
        type: Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    senderId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
messageSchema.index({ recipientId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, recipientId: 1 });
messageSchema.index({ isRead: 1 });

const messageModel = mongoose.models.Message || model("Message", messageSchema);

export default messageModel;