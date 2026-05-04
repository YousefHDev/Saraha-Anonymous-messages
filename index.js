import  bootstrap  from './src/app.controller.js'
import * as  dotenv from 'dotenv';
dotenv.config({path:'./src/config/.env.dev'})
import  express  from 'express'
import { sendEmail } from './src/utiles/email/send.email.js';
const app = express()
const port = process.env.PORT || 8000
bootstrap(app , express)



//await sendEmail({to:"adhamh430@gmail.com", html:'<h1>Welcome Node.js</h1>'})


 




app.listen(port, () => console.log(`Example app listening on port ${port}!`))