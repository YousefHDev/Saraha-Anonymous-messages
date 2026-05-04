import { userRoles } from "../../middleware/auth.middleware.js";



export const endpoints = {
    getProfile: [userRoles.user, userRoles.admin],
    updateProfile: [userRoles.user, userRoles.admin],
    deleteProfile: [userRoles.admin],
    getAllUsers: [userRoles.admin]
};