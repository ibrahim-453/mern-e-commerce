import express from "express"
import { verifyJWT } from "../middlewares/auth.js"
import upload from "../middlewares/multer.js"
import { createProduct, deleteProduct, editProduct, getAdminProducts, getAllProducts } from "../controllers/product.controller.js"

const router = express.Router()

router.route("/create-product").post(verifyJWT,upload.array("images"),createProduct)
router.route("/get-products").get(getAllProducts)
router.route("/dashboard/admin-products").get(verifyJWT,getAdminProducts)
router.route("/dashboard/edit-product/:productId").put(verifyJWT,upload.array("images"),editProduct)
router.route("/dashboard/delete-product/:productId").delete(verifyJWT,deleteProduct)

export default router