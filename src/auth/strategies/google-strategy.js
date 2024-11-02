import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as dotenv from "dotenv";
import UsersModel from "../../models/UsersModel.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { error: searchError, user } = await UsersModel.getUserById(id);

  if (searchError) {
    return done(new Error(searchError.message), null);
  }

  return user ? done(null, user) : done(null, null);
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
      let { error: searchError, user } = await UsersModel.getUserByGoogleId(
        profile.id
      );

      if (searchError) {
        return done(new Error(searchError.message), null);
      }

      if (!user) {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        let { error: insertError, userId } = await UsersModel.insertNewUser(
          newUser
        );

        if (insertError) {
          return done(new Error(insertError.message), null);
        }

        let { error: searchError, user } = await UsersModel.getUserById(
          userId[0]
        );

        if (searchError) {
          return done(new Error(searchError.message), false);
        }

        return done(null, user);
      }

      return done(null, user);
    }
  )
);
