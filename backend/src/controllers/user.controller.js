import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const resetToken = asyncHandler(async (req, res) => {
  let { token } = req.body;
  let userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized Request");
  }
  if (!token) {
    throw new ApiError(401, "please provide OTP sent to your email");
  }
  let user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  let resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  let resetCodeExpiry = Date.now + 10 * 60 * 1000;

  user.ResetToken = resetCode;
  user.ResetTokenExpiry = resetCodeExpiry;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Reset OTP sent to Email", {}));
});

const verifyResetToken = asyncHandler(async (req, res) => {
  let { token } = req.body;
  let userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized Request");
  }
  if (!token) {
    throw new ApiError(401, "Unauthorized Request");
  }
  let user = await User.findOne({ _id: userId });
  if (
    !user.ResetToken ||
    user.ResetToken !== token ||
    Date.now() > user.ResetTokenExpiry
  ) {
    throw new ApiError(401, "Unauthorized Request");
  }
  user.isResetTokenVerified = true;
  user.ResetToken = "";
  user.ResetTokenExpiry = undefined;
  await user.save();
  return res.status(200).json(new ApiResponse(200, "Reset OTP Verified", {}));
});

const changePassword = asyncHandler(async (req, res) => {
  let { newPassword } = req.body;
  let userId = req.user._id;
  if (!newPassword) {
    throw new ApiError(401, "Please provide new password");
  }
  if (userId) {
    throw new ApiError(401, "Unauthorized Request");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  let user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  if (!user.isResetTokenVerified) {
    throw new ApiError(401, "Unathorized Request");
  }
  user.isResetTokenVerified = false;
  user.password = hash;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed Successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  let role = req.user.role;
  if (role !== "admin") {
    throw new ApiError(401, "Unauthorized Request");
  }
  const user = await User.find().select(
    "-password -refreshToken -VerifyToken -ResetToken"
  );
  if (!user) {
    throw new ApiError(404, "No User Found");
  }
  return res.status(200).json(new ApiResponse(200, "Users Fetched", { user }));
});

export { resetToken, verifyResetToken, changePassword, getAllUsers };
