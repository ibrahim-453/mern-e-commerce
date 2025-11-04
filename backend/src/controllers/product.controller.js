import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, mainCategoryName, subCategoryName, stock, price } = req.body;
  const role = req.user?.role;

  if (role !== "admin") throw new ApiError(401, "Unauthorized request");

  if ([name, description, mainCategoryName, subCategoryName].some((f) => !f?.trim()) ||
      stock == null ||
      price == null) {
    throw new ApiError(400, "All fields are required");
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No images uploaded");
  }

  const uploadedImages = [];
  for (const file of req.files) {
    const upload = await uploadOnCloudinary(file.path);
    uploadedImages.push(upload.url);
  }

  if (uploadedImages.length > 3) {
    throw new ApiError(400, "You can upload a maximum of 3 images");
  }

  const slug = name.trim().toLowerCase().replace(/\s+/g, "+");

  const product = await Product.create({
    name,
    description,
    mainCategory: mainCategoryName.trim(),
    subCategory: subCategoryName.trim().toLowerCase(),
    slug,
    images: uploadedImages,
    stock,
    price,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, `Product '${name}' created successfully`, product));
});

// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
  const startIndex = parseInt(req.query.startIndex || 0);
  const limit = parseInt(req.query.limit || 9);
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const filter = {};
  const { productId, price, slug, searchTerm, mainCategoryName, subCategoryName } = req.query;

  if (productId) filter._id = productId;
  if (price) filter.price = price;
  if (slug) filter.slug = slug;
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }
  if (mainCategoryName) filter.mainCategory = mainCategoryName.trim();
  if (subCategoryName) filter.subCategory = subCategoryName.trim().toLowerCase();

  const products = await Product.find(filter)
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: sortDirection });

  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastMonth = await Product.countDocuments({ createdAt: { $gte: oneMonthAgo } });

  return res.status(200).json(new ApiResponse(200, "Products fetched", { products, lastMonth }));
});

// GET ADMIN PRODUCTS
const getAdminProducts = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  if (role !== "admin") throw new ApiError(401, "Unauthorized request");

  const startIndex = parseInt(req.query.startIndex || 0);
  const limit = parseInt(req.query.limit || 9);
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const filter = {};
  const { productId, price, slug, searchTerm, mainCategory, subCategory } = req.query;

  if (productId) filter._id = productId;
  if (price) filter.price = price;
  if (slug) filter.slug = slug;
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }
  if (mainCategory) filter.mainCategory = mainCategory.trim();
  if (subCategory) filter.subCategory = subCategory.trim().toLowerCase();

  const products = await Product.find(filter)
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: sortDirection });

  const totalProducts = await Product.countDocuments();
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const lastMonth = await Product.countDocuments({ createdAt: { $gte: oneMonthAgo } });

  return res.status(200).json(
    new ApiResponse(200, "Admin products fetched", {
      products,
      totalProducts,
      lastMonth,
    })
  );
});

// EDIT PRODUCT
const editProduct = asyncHandler(async (req, res) => {
  const { name, description, mainCategoryName, subCategoryName, stock, price, existingImages } = req.body;
  const { productId } = req.params;
  const role = req.user?.role;

  if (role !== "admin") throw new ApiError(401, "Unauthorized request");
  if (!productId) throw new ApiError(404, "Product not found");

  if ([name, description, mainCategoryName, subCategoryName].some((f) => !f?.trim()) ||
      stock == null ||
      price == null) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let updatedImages = [];
  try {
    updatedImages = JSON.parse(existingImages) || [];
  } catch {
    updatedImages = [];
  }

  if (req.files && req.files.length > 0) {
    const uploaded = [];
    for (const file of req.files) {
      const cloud = await uploadOnCloudinary(file.path);
      if (cloud?.url) uploaded.push(cloud.url);
    }
    updatedImages = [...updatedImages, ...uploaded];
  }

  if (updatedImages.length > 3) throw new ApiError(400, "You can upload a maximum of 3 images");

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      mainCategory: mainCategoryName.trim(),
      subCategory: subCategoryName.trim().toLowerCase(),
      images: updatedImages,
      stock,
      price,
      slug: name.trim().toLowerCase().replace(/\s+/g, "+"),
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, "Product updated successfully", updatedProduct));
});

// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const role = req.user?.role;

  if (role !== "admin") throw new ApiError(401, "Unauthorized request");
  if (!productId) throw new ApiError(404, "Product ID missing");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  await Product.findByIdAndDelete(productId);
  return res.status(200).json(new ApiResponse(200, "Product deleted successfully"));
});

export { createProduct, getAllProducts, getAdminProducts, editProduct, deleteProduct };
