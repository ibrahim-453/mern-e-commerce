import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import Stripe from "stripe";
import transporter from "../utils/NodeMailer.js";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckOutSession = asyncHandler(async (req, res) => {
  const shippingAddress = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0)
    throw new ApiError(400, "Cart is empty");

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const line_items = cart.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
        images: [item.product.images[0]],
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    metadata: {
      userId: userId.toString(),
      shippingAddress: JSON.stringify(shippingAddress),
      totalPrice: totalAmount,
      items: JSON.stringify(
        cart.items.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
        }))
      ),
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Checkout session created", { url: session.url })
    );
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) throw new ApiError(400, "Session ID is required");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session) throw new ApiError(400, "Session not found");
  if (session.payment_status !== "paid")
    throw new ApiError(400, "Payment not completed");

  const userId = session.metadata.userId;
  const shippingAddress = JSON.parse(session.metadata.shippingAddress);
  const totalPrice = session.metadata.totalPrice;
  const items = JSON.parse(session.metadata.items);
  const orderId = "ORD-" + uuidv4().split("-")[0].toUpperCase();

  const order = await Order.create({
    orderId,
    customer: userId,
    items: items.map((i) => ({
      product: i.productId,
      quantity: i.quantity,
    })),
    totalPrice,
    shippingAddress,
    paymentId: session.payment_intent,
    paymentStatus: "Paid",
    orderStatus: "processing",
  });

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock -= item.quantity;
      if (product.stock < 0) product.stock = 0;
      await product.save();
    }
  }

  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalItems: 0, totalPrice: 0 }
  );

  const user = await User.findById(userId);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: order.shippingAddress.email,
    subject: "Order Confirmation - Payment Successful",
    html: `
      <h2>Order Confirmed✅</h2>
      <p>Hi ${user.fullname},</p>
      <p>We’ve received your payment of <strong>$${totalPrice} against Order ID : ${orderId}</strong>. Your order is now being processed.</p>
      <h3>Shipping Address:</h3>
      <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}, ${order.shippingAddress.postalcode}</p>
      <h3>Order Details:</h3>
      <ul>
        ${items.map((i) => `<li>${i.productName} - Quantity: ${i.quantity}</li>`).join("")}
      </ul>
      <p>We'll notify you once your order is shipped.</p>
      <br/>
      <p>Thanks for shopping with us!</p>
      <p><strong>Your EZ-SHOP Team</strong></p>
    `,
  };
  transporter.sendMail(mailOptions);
  return res
    .status(200)
    .json(new ApiResponse(200, "Order created successfully", { order }));
});

const getMyOrder = asyncHandler(async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const userId = req.user._id;
  const orders = await Order.find({ customer: userId })
    .populate("items.product")
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: sortDirection });
  return res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", { orders }));
});

const getAdminOrders = asyncHandler(async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const role = req.user.role;
  if (role !== "admin") {
    throw new ApiError(401, "Unauthorized Request");
  }
  const orders = await Order.find()
    .populate("items.product")
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: sortDirection });
  const totalOrders = await Order.countDocuments();
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastMonthOrders = await Order.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });
  return res.status(200).json(
    new ApiResponse(200, "Orders fetched successfully", {
      orders,
      totalOrders,
      lastMonthOrders,
    })
  );
});

const getOrder = asyncHandler(async (req, res) => {
  let { orderId } = req.params;

  const order = await Order.findOne({ orderId }).populate("items.product");
  if (!order) throw new ApiError(404, "Order not found");
  return res
    .status(200)
    .json(new ApiResponse(200, "Order fetched successfully", { order }));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const role = req.user.role;
  if (role !== "admin") {
    throw new ApiError(401, "Unauthorized Request");
  }
  const order = await Order.findOne({ orderId }).populate("items.product");
  if (!order) throw new ApiError(404, "Order not found");
  order.orderStatus = status;
  await order.save();
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: order.shippingAddress.email,
    subject: "Order Status",
    html: `
      <h2>Order ${order.orderStatus}</h2>
      <p>Hi ${order.shippingAddress.fullname},</p>
      <p>Your Order against Order ID : ${order.orderId}</strong> is now being ${order.orderStatus}.</p>
      <h3>${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)} Address:</h3>
      <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}, ${order.shippingAddress.postalcode}</p>
      <h3>Order Details:</h3>
      <ul>
        ${order.items.map((i) => `<li>${i.product.name} - Quantity: ${i.quantity}</li>`).join("")}
      </ul>
      <p>We'll notify you once your order is delivered.</p>
      <br/>
      <p>Thanks for shopping with us!</p>
      <p><strong>Your EZ-SHOP Team</strong></p>
    `,
  };
  transporter.sendMail(mailOptions);
  return res
    .status(200)
    .json(new ApiResponse(200, "Order status updated successfully", { order }));
});

export {
  createCheckOutSession,
  confirmPayment,
  getMyOrder,
  getAdminOrders,
  updateOrderStatus,
  getOrder,
};
