import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { sendOtp, verifyOtp } from '../controllers/authController';

const router = Router();

// --- Email/OTP Routes ---
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// --- Google OAuth Routes ---
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user: any = req.user;
    const payload = {
      userId: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    
    const fe_url = process.env.FRONTEND_URL || 'http://localhost:5173'
    res.redirect(`${fe_url}/auth/callback?token=${token}&user=${JSON.stringify(payload)}`);
  }
);

export default router;