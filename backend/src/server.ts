import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import './config/passport';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));