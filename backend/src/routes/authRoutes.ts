import { Router } from "express";
import {
  sendSignupOtp,
  sendLoginOtp,
  verifyOtp,
} from "../controllers/authController";

const router = Router();

// Route for SIGNUP
router.post("/send-signup-otp", sendSignupOtp);

// Route for LOGIN
router.post("/send-login-otp", sendLoginOtp);

// Shared route for verifying OTP
router.post("/verify-otp", verifyOtp);

export default router;
