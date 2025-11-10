import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      requied: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isResetTokenVerified: {
      type: Boolean,
      default: false,
    },
    VerifyToken: {
      type: String,
      default: "",
    },
    ResetToken: {
      type: String,
      default: "",
    },
    VerifyTokenExpiry: {
      type: Date,
      default: undefined,
    },
    ResetTokenExpiry: {
      type: Date,
      default: undefined,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
