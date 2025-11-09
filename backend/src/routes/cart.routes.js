import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import { addToCart, clearCart, getCart, removeFromCart, updateCartQuantity } from "../controllers/cart.controller.js"

const router = express.Router()

router.route("/add-to-cart/:productId").post(verifyJWT,addToCart)
router.route("/remove-from-cart/:productId").delete(verifyJWT,removeFromCart)
router.route("/clear-cart").put(verifyJWT,clearCart)
router.route("/my-cart").get(verifyJWT,getCart)
router.route("/update-cart/:productId").put(verifyJWT,updateCartQuantity)

export default router