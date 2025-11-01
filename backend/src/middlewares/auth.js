import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Access Denied");
    }
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user = await User.findOne({ _id: decodedUser?.id });
    if (!user) {
      throw new ApiError(404, "User not found or deleted");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Token or Expired");
  }
};

export { verifyJWT };
