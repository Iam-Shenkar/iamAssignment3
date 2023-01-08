const { Account, User } = require('../repositories/repositories.init');

const logout = async (req, res) => {
  await User.update({ email: req.body.email }, { refreshToken: 0 });
  res.set({ authorization: 'Bearer 0' });
  res.clearCookie('email');
  res.clearCookie('name');
  res.clearCookie('role');
  res.clearCookie('account');
  res.clearCookie('jwt');
  res.status(200).redirect('../');
};

module.exports = { logout };
