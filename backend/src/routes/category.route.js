import express from 'express'
import { getAllCategories, getProductByCategory, getProductBySubCategory, getSubCategory } from '../controllers/category.controller.js'

const router = express.Router()

router.route("/categories").get(getAllCategories)
router.route("/categories/:mainCategoryName/products").get(getProductByCategory)
router.route("/categories/:mainCategoryName/subCategories").get(getSubCategory)
router.route("/categories/:mainCategoryName/subCategories/:subCategoryName/products").get(getProductBySubCategory)

export default router