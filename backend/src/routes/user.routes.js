import express from 'express'
import { verifyJWT } from '../middlewares/auth.js'
import { changePassword, deleteUser, getAllUsers, resetToken, verifyResetToken } from '../controllers/user.controller.js'
const router = express.Router()

router.route("/reset-token").post(verifyJWT,resetToken)
router.route("/verify-token").post(verifyJWT,verifyResetToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/all-users").get(verifyJWT,getAllUsers)
router.route("/delete-user/:userEmail").delete(verifyJWT,deleteUser)

export default router