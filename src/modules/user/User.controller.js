import { Router } from "express";
import { getProfile, updateProfile , updatePassword, freezeProfile, shareProfile } from "./User.service.js"; 
import { authentication } from "../../middleware/auth.middleware.js";
import { endpoints } from "./User.endpoint.js";
const router = Router()

router.get("/profile" , authentication(endpoints.getProfile), getProfile )

router.get("/profile/:id" ,  shareProfile )

router.patch("/profile" , authentication(endpoints.updateProfile), updateProfile )

router.patch("/profile/password" , authentication(endpoints.updatePassword), updatePassword )

router.delete("/profile" , authentication(endpoints.freezeProfile), freezeProfile )








export default router