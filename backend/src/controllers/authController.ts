import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User';
import { generateOtp } from '../util/generateOtp';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendSignupOtp = async (req: Request, res: Response) => {
    const { email, name, dateOfBirth } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists. Please sign in.' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        
        user = new User({ email, name, dateOfBirth, otp, otpExpires });
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER, to: email, subject: 'Your NoteIT OTP Code', text: `Your OTP code is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ msg: 'OTP sent to email for verification.' });

    } catch (err: any) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const sendLoginOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({
          msg: "No account found with this email. Please sign up first.",
        });
    }

    if (user.googleId) {
      return res
        .status(400)
        .json({
          msg: "This account is linked with Google. Please use Google to sign in.",
        });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your NoteIT OTP Code",
      text: `Your OTP code is ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "OTP sent to email for login." });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp, rememberMe } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        
        const payload = { userId: user.id, name: user.name, email: user.email };
        const tokenExpiration = rememberMe ? '30d' : '1h';

        const token = jwt.sign(payload, process.env.JWT_SECRET!, { 
            expiresIn: tokenExpiration 
        });

        res.status(200).json({ token, user: payload });
    } catch (err:any) {
        res.status(500).send('Server error');
    }
};
