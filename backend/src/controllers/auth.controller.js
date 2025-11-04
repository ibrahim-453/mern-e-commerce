import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../config/passport.js";
import transporter from "../utils/NodeMailer.js";
import validator from "validator";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
};

const accessTokenOptions = {
  ...cookieOptions,
  maxAge: 24 * 60 * 60 * 1000,
};
const refreshTokenOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

// ------------------ Local Register ------------------
const register = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password)
    throw new ApiError(400, "Please fill all fields");
  if (!validator.isEmail(email)) {
    throw new ApiError(401, "Invalid Email Address");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

  const hash = await bcrypt.hash(password, 10);
  const username =
    fullname.replace(/\s+/g, "").toLowerCase() +
    Math.floor(100 + Math.random() * 900);

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationTokenExpiry = Date.now() + 10 * 60 * 1000;

  const user = await User.create({
    fullname,
    username,
    email,
    password: hash,
    VerifyToken: verificationToken,
    VerifyTokenExpiry: verificationTokenExpiry,
  });
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Email Verification - EZ SHOP",
    text: `Your verification code is: ${verificationToken}\nThis code will expire in 10 minutes.\n\nThank you for registering with EZ SHOP!`,
  };
  transporter.sendMail(mailOptions);
  res.status(201).json(new ApiResponse(201, "Account created", { user }));
});

// ------------------ Verify Email OTP ------------------
const verifyToken = asyncHandler(async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) throw new ApiError(400, "Email and OTP required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "Invalid user");

  if (user.isVerified)
    return res.status(200).json(new ApiResponse(200, "Already verified", {}));

  if (user.VerifyToken !== token || Date.now() > user.VerifyTokenExpiry)
    throw new ApiError(401, "Invalid or expired OTP");

  user.isVerified = true;
  user.VerifyToken = undefined;
  user.VerifyTokenExpiry = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, "Account verified successfully"));
});

// ------------------ Local Login ------------------
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Please fill all fields");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, "Incorrect password");

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save();
  let safeUser = await User.findOne({ _id: user._id }).select(
    "-password -refreshToken -VerifyToken -ResetToken"
  );

  res
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .status(200)
    .json(new ApiResponse(200, "Login successful", { safeUser }));
});

// ------------------ Logout ------------------
const logout = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = null;
  await user.save();

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, "Logout successful"));
});

// ------------------ Google OAuth ------------------
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(400, "Google authentication failed");
    
    const dbUser = (await User.findById(user._id)) || user;

    const { accessToken, refreshToken } = generateTokens(dbUser);
    dbUser.refreshToken = refreshToken;
    await dbUser.save();

    return res
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .redirect(`${process.env.FRONTEND_URL}/auth/success`);
  }),
];

// ------------------ Refresh Access Token ------------------
const newAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new ApiError(404, "Refresh Token Not found");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded?.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
  const { accessToken } = generateTokens(user);

  return res
    .cookie("accessToken", accessToken, accessTokenOptions)

    .status(200)
    .json(new ApiResponse(200, "Access token renewed", { user }));
});

// ------------------ Get User ------------------
const getUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const safeUser = await User.findOne({ _id: userId }).select(
    "-password -refreshToken"
  );
  if (!safeUser) throw new ApiError(404, "User Not Found");

  return res
    .status(200)
    .json(new ApiResponse(200, "User Fetched", { safeUser }));
});

export {
  register,
  verifyToken,
  login,
  logout,
  googleAuth,
  googleCallback,
  newAccessToken,
  getUser,
};
