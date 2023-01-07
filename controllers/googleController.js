const { User } = require('../repositories/repositories.init');

const handleGoogleCallBack = async (req, res) => {
  // cookies
  res.cookie('jwt', req.authInfo.refToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  await User.update(
    { email: req.authInfo.email },
    {
      loginDate: new Date(),
      refreshToken: req.authInfo.refToken,
    },
  );
  res.cookie('email', req.authInfo.email);
  res.cookie('name', req.authInfo.name);
  res.cookie('role', req.authInfo.type);
  res.cookie('account', req.authInfo.accountId);
  res.redirect('/');
};

module.exports = { handleGoogleCallBack };
