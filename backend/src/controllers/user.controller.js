import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import transporter from "../utils/NodeMailer.js";

const resetToken = asyncHandler(async (req, res) => {
  let userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized Request");
  }
  let user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  let resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  let resetCodeExpiry = Date.now() + 10 * 60 * 1000;

  user.ResetToken = resetCode;
  user.ResetTokenExpiry = resetCodeExpiry;
  await user.save();
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Reset Password OTP",
    text: `Your verification code for Password Change is: ${resetCode}\nThis code will expire in 10 minutes.`,
  };
  transporter.sendMail(mailOptions);
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
  if (!userId) {
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
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  if (role !== "admin") {
    throw new ApiError(401, "Unauthorized Request");
  }
  const users = await User.find()
  .select("-password -refreshToken -VerifyToken -ResetToken")
  .skip(startIndex)
  .limit(limit)
  .sort({ createdAt: sortDirection });
  const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
  if (!users) {
    throw new ApiError(404, "No User Found");
  }
  return res.status(200).json(new ApiResponse(200, "Users Fetched", { users, totalUsers, lastMonthUsers }));
});

const deleteUser = asyncHandler(async(req,res)=>{
  let {userEmail} = req.params
  let role = req.user.role
  if(role !== "admin"){
    throw new ApiError(401, "Unauthorized Request")
  }
  let user = await User.findOne({email: userEmail})
  if(!user){
    throw new ApiError(404, "User Not Found")
  }
  const deleteUser = await User.findOneAndDelete({email: userEmail})

  return res 
  .status(200)
  .json(
    new ApiResponse(200,"User Deleted",{})
  )
})

export { resetToken, verifyResetToken, changePassword, getAllUsers, deleteUser };
