import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';

// Define the type for the 'done' callback function for clarity
type DoneFunction = (error: any, user?: any) => void;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: DoneFunction) => {
      try {
        // Find if a user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, proceed
          return done(null, user);
        }

        // If not, check if a user exists with the same email
        user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          // If a user with this email exists (e.g., signed up via OTP),
          // link their Google ID to their existing account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // If no user exists at all, create a new one
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        // Pass the error to the 'done' callback
        return done(err, false);
      }
    }
  )
);