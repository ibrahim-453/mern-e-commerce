import express from "express";
import {
  login,
  logout,
  register,
  verifyToken,
  googleAuth,
  googleCallback,
  newAccessToken,
  getUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = express.Router();

router.route("/create-account").post(register);
router.route("/verify-email").post(verifyToken);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/google").get(googleAuth);
router.route("/google/callback").get(googleCallback);
router.route("/refreshToken").post(newAccessToken);
router.route("/me").get(verifyJWT, getUser);

export default router;
