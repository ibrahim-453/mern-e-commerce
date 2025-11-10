import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import { confirmPayment, createCheckOutSession, getAdminOrders, getMyOrder, getOrder, updateOrderStatus } from "../controllers/order.controller.js"

const router = express.Router()

router.route("/create-checkout-session").post(verifyJWT,createCheckOutSession)
router.route("/confirm-payment").post(verifyJWT,confirmPayment)
router.route("/get-my-orders").get(verifyJWT,getMyOrder)
router.route("/get-admin-orders").get(verifyJWT,getAdminOrders)
router.route("/get-order/:orderId").get(verifyJWT,getOrder)
router.route("/update-order-status/:orderId").put(verifyJWT,updateOrderStatus)

export default router