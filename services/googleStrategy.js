const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const { Account, User } = require('../repositories/repositories.init');

const GOOGLE_CLIENT_ID = process.env.ClientId;
const GOOGLE_CLIENT_SECRET = process.env.ClientSecret;
const { runningPath } = process.env;

passport.use(new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${runningPath}/auth/google/callback`,
  },
  async (request, accessToken, refreshToken, profile, done) => {
    const {
      id: googleId,
      displayName: username,
      given_name: firstName,
      family_name: lastName,
      picture: photo,
      email,
    } = profile;
    let findUser = await User.retrieve({ email });
    if (!findUser) {
      User.create({
        name: username, googleId, email, password: 'null', loginDate: new Date(),
      });
      findUser = await User.retrieve({ email: email });
    }
    const token = jwt.sign({ email: findUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refToken = jwt.sign({ email: findUser.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    await User.update({ email: findUser.email }, { refreshToken: refToken });
    const data = {
      token,
      refToken,
      email,
      type: findUser.type,
      name: findUser.name,
      accountId: findUser.accountId,
    };
    return done(null, findUser, data);
  },
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
