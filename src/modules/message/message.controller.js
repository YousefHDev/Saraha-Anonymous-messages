import { Router } from "express";
import { sendMessage } from "./message.service.js";
import * as validators from './message.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
const router = Router()
router.post("/" ,
    validation(validators.sendMessageValidation),
    sendMessage)


export default router