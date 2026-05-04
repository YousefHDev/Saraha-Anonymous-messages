import joi from "joi";

export const sendMessageValidation = joi.object({
    receiverId: joi.string().hex().length(24).required(),
    content: joi.string().min(1).max(500).required(),
    attachments: joi.array().items(
        joi.object({
            type: joi.string().valid('image', 'document', 'video', 'audio'),
            url: joi.string().uri(),
            public_id: joi.string()
        })
    )
});


export const messageIdValidation = joi.object({
    messageId: joi.string().hex().length(24).required()
});