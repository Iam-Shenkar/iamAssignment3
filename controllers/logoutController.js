const { User } = require('../services/authService');

const logout = async (req, res) => {
  console.log('logging out user: ', req.body.email);
  await User.update({ email: req.body.email }, { refreshToken: 0 });
  res.set({ authorization: 'Bearer 0' });
  res.clearCookie('email');
  res.clearCookie('name');
  res.clearCookie('role');
  res.clearCookie('account');
  res.clearCookie('jwt');
  res.redirect('../');
};

module.exports = { logout };
