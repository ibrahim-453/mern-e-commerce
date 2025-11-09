import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import { confirmPayment, createCheckOutSession } from "../controllers/order.controller.js"

const router = express.Router()

router.route("/create-checkout-session").post(verifyJWT,createCheckOutSession)
router.route("/confirm-payment").post(verifyJWT,confirmPayment)

export default router