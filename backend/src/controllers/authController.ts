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

export const sendOtp = async (req: Request, res: Response) => {
    const { email } = req.body; 
    try {
        if (!email) {
            return res.status(400).json({ msg: 'Email is required.' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        let user = await User.findOne({ email });

        if (user && user.googleId) {
            return res.status(400).json({ msg: 'This account is linked with Google. Please use Google to sign in.' });
        }

        if (user) {
            user.otp = otp;
            user.otpExpires = otpExpires;
        } else {
            const nameFromEmail = email.split('@')[0];
            user = new User({
                email,
                name: nameFromEmail,
                otp,
                otpExpires
            });
        }
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your NoteIT OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'OTP sent to email' });

    } catch (err: any) {
        console.error(err);
        res.status(500).send('Error sending OTP');
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        
        const payload = { userId: user.id, name: user.name, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.status(200).json({ token, user: payload });
    } catch (err:any) {
        res.status(500).send('Server error');
    }
};