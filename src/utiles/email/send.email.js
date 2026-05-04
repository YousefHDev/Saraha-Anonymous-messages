import nodemailer from "nodemailer";


export const sendEmail= async({to="" ,cc="" ,bcc="" ,text="",html="",subject="" ,attachments=[]}={})=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
     
      auth: {
        user: process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD ,
      },
    });
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"ROUTE ACADEMY 👻" <adhamh430@gmail.com>', // sender address
        to: "adhamh430@gmail.com", // list of receivers
        subject:"Hello world" , // Subject line
        text:"Hello world" , // plain text body
        html:"<b> Hello world </b>", // html body
        attachments,
        bcc,
        cc,
      });
    
     // console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
    
    main().catch(console.error);
    
}