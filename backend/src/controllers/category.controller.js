import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const getAllCategories = asyncHandler(async(req,res)=>{
    const categories = await Product.distinct("mainCategory")
    if(!categories.length){
        throw new ApiError(404,"No Category Found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,"All Categories Fetched", {categories})
    )
})

const getProductByCategory = asyncHandler(async(req,res)=>{
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === "asc" ? 1 : -1
    const {mainCategoryName} = req.params
    if(!mainCategoryName){
        throw new ApiError(401,"Category Name Not Found")
    }
    const products = await Product.find({mainCategory:mainCategoryName.trim()})
    .skip(startIndex)
    .limit(limit)
    .sort({createdAt : sortDirection})
    if(!products){
        throw new ApiError(404,"No Product Found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,"Products Fetched",{products})
    )
})

const getSubCategory = asyncHandler(async(req,res)=>{
    const {mainCategoryName} = req.params
    if(!mainCategoryName){
        throw new ApiError(401,"Category Name Not Found")
    }
    const subCategory = await Product.distinct("subCategory",{mainCategory:mainCategoryName.trim()})
    if(!subCategory){
        throw new ApiError(404,"No Sub Category Found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,"Sub Catgories Fetched",{subCategory})
    )
})

const getProductBySubCategory = asyncHandler(async(req,res)=>{
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === "asc" ? 1 : -1
    const {mainCategoryName,subCategoryName} = req.params
    if(!mainCategoryName || !subCategoryName){
        throw new ApiError(401, "Category Name Not Found")
    }
    const products = await Product.find({mainCategory:mainCategoryName.trim(), subCategory:subCategoryName.trim()})
    .skip(startIndex)
    .limit(limit)
    .sort({createdAt : sortDirection})
    if(!products){
        throw new ApiError(404, "No Product Found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Products Fetched", {products})
    )
})

export {getAllCategories, getProductByCategory, getSubCategory, getProductBySubCategory}