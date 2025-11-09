import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";

const addToCart = asyncHandler(async (req, res) => {
  let { quantity } = req.body;
  let { productId } = req.params;
  let userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Please Login");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalPrice: 0,
      totalItems: 0,
    });
  }
  const existingItem = cart.items.find(
    (item) => item.product._id.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  cart = await cart.populate("items.product");
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  cart.totalPrice = totalPrice;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalItems = totalItems;
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Item Added to Cart", { cart }));
});

const removeFromCart = asyncHandler(async (req, res) => {
  let { productId } = req.params;
  let userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Please Login");
  }
  if (!productId) {
    throw new ApiError(400, "Product Not Found");
  }
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    throw new ApiError(404, "No Cart Found");
  }
  const itemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId
  );
  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in Cart");
  }
  cart.items.splice(itemIndex, 1);
  await cart.save();
  cart = await cart.populate("items.product");
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  cart.totalPrice = totalPrice;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalItems = totalItems;
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Item deleted from Cart", { cart }));
});

const getCart = asyncHandler(async (req, res) => {
  let userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    throw new ApiError(404, "No Cart Found");
  }
  return res.status(200).json(new ApiResponse(200, "Cart Fetched", { cart }));
});

const updateCartQuantity = asyncHandler(async (req, res) => {
  let { action } = req.body;
  let userId = req.user._id;
  let { productId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    throw new ApiError(404, "Cart Not Found");
  }
  const item = cart.items.find(
    (item) => item.product._id.toString() == productId
  );
  if (!item) {
    throw new ApiError(404, "Products Not Found");
  }
  if (action == "increase") {
    item.quantity += 1;
  } else if (item.quantity > 1 && action == "decrease") {
    item.quantity -= 1;
  }
  await cart.save();
  cart = await cart.populate("items.product");
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  cart.totalPrice = totalPrice;
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalItems = totalItems;
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart quantity updated", { cart }));
});

const clearCart = asyncHandler(async (req, res) => {
  let userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "Please Login");
  }
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "No Cart Found");
  }
  cart.items = [];
  cart.totalPrice = 0;
  cart.totalItems = 0;
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart cleared successfully", { cart }));
});

export { addToCart, removeFromCart, clearCart, getCart, updateCartQuantity };
