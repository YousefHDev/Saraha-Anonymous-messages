import messageModel from "../../DB/model/message.model.js";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../../utiles/error/error.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
    const { message, recipientId } = req.body;
    const senderId = req.user._id;

    // Check if recipient exists and is not deleted
    const recipient = await userModel.findOne({ _id: recipientId, isDeleted: false });
    
    if (!recipient) {
        return next(new Error("Invalid account", { cause: 404 }));
    }

    // Check if trying to send message to self
    if (senderId.toString() === recipientId) {
        return next(new Error("Cannot send message to yourself", { cause: 400 }));
    }

    // Create new message
    const newMessage = await messageModel.create({ 
        message, 
        recipientId, 
        senderId 
    });

    // Populate sender details for response
    const populatedMessage = await messageModel.findById(newMessage._id)
        .populate('senderId', 'username image')
        .populate('recipientId', 'username image');

    return ({ 
        res, 
        message: "Message sent successfully", 
        status: 201, 
        data: { message: populatedMessage } 
    });
});