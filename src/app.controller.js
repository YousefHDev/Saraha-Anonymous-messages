import connectDB from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import Usercontroller from './modules/user/User.controller.js'
import { globalErrorHandling } from './utiles/error/error.js'
import messagecontroller from './modules/message/message.controller.js'


const bootstrap = (app, express) => {
    app.use(express.json())

    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", Usercontroller)
    app.use("/message", messagecontroller)



    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })


    
    app.use(globalErrorHandling)
    


    connectDB()
}

export default bootstrap