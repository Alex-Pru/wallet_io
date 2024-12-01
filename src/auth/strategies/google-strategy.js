import passport from "passport";
import HttpError from "../../utils/HttpError.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as dotenv from "dotenv";
import UsersModel from "../../models/UsersModel.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsersModel.getUserById(id);

    return user ? done(null, user) : done(null, null);
  } catch (err) {
    const error = new HttpError("Failed to fetch user", 500);
    return done(error, null);
  }
});

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let user;

      try {
        user = await UsersModel.getUserByGoogleId(profile.id);
      } catch (err) {
        console.log(err);
        const error = new HttpError("Failed to fetch user", 500);
        return done(error, null);
      }

      if (!user) {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        let userId;

        try {
          userId = await UsersModel.insertNewUser(newUser);
        } catch (err) {
          const error = new HttpError("Failed to register user", 500);
          return done(error, null);
        }

        try {
          user = await UsersModel.getUserById(userId[0]).user;
        } catch (err) {
          const error = new HttpError("Failed to fetch user", 500);
          return done(error, null);
        }
      }

      return done(null, user);
    }
  )
);
