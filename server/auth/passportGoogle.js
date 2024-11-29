const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User'); // Using require instead of import

// Set up Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create a user in your database
        const [user] = await User.findOrCreate({
          where: { oauthId: profile.id, oauthProvider: 'google' },
          defaults: {
            username: profile.displayName, // Use displayName or any name field
            email: profile.emails?.[0]?.value || null, // Google returns email in profile
            accessToken,
            refreshToken,
          },
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
