const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

const callbackURL = process.env.NODE_ENV === 'production'
  ? `${process.env.SERVER_URL}/api/auth/google/callback`
  : '/api/auth/google/callback';


passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL, // Use the dynamic URL
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    // This function is called after the user logs in with Google

    // --- G SUITE DOMAIN VALIDATION ---
    // const email = profile.emails[0].value;
    // if (email.split('@')[1] !== process.env.G_SUITE_DOMAIN) {
    //   // If the domain does not match, return an error
    //   return done(new Error('Invalid host domain.'), null);
    // }
    // // ------------------------------------

    try {
      // Check if user already exists in our DB
      let existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // If they exist, we're done
        return done(null, existingUser);
      }
      
      // If they don't exist, create a new user in our DB
      const newUser = await new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        image: profile.photos[0].value,
      }).save();

      done(null, newUser);

    } catch (error) {
      done(error, null);
    }
  })
);