import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0].value });
        const randomPassword = crypto.randomBytes(4).toString("hex");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(randomPassword, salt);
        if (!user) {
          user = await User.create({
            fullname: profile.displayName,
            email: profile.emails?.[0].value,
            username:
              profile.displayName.replace(/\s+/g, "").toLowerCase() +
              Math.floor(100 + Math.random() * 900).toString(),
            password: hash,
            isVerified: true,
            role: "user",
          });
        }
        return done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
export default passport;
