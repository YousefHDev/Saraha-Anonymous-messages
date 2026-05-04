import { EventEmitter } from "node:events";
import iwt from 'jsonwebtoken'
import { sendEmail } from "../email/send.email.js";
import { generateToken } from "../security/token.js";
import { ConfirmEmailTemplate } from "../email/templete/confirmEmail.js";
export const emailEvent = new EventEmitter()

emailEvent.on("sendConfirmEmail", async({email} = {})=>{
    const emailToken= generateToken({payload :{email},signature: process.env.EMAIL_TOKEN_SIGNATIRE})
        const emailLink=  `${process.env.FR_URL} /confirm-email/ ${emailToken}`
        const html= ConfirmEmailTemplate({link:emailLink})
        //'<a href=https://workplace.clickworker.com/en/sessions/new>Click Me</a>'

        await sendEmail({to: email , subject: "confirm email",html})


})
