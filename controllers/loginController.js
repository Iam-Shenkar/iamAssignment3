const bcrypt = require('bcrypt');
const { User } = require('../services/authService');
const {
  userExist, userStatusCheck, validPassword, accountStatusCheck,
} = require('../services/authService');
const { generatePassword, sendEmailPassword } = require('../services/authService');
const { httpError } = require('../class/httpError');

const loginControl = async (req, res, next) => {
  try {
    const user = await userExist(req.body.email);

    if (!user) throw new httpError(404, 'user not exist');
    if (user.accountId !== 'none') await accountStatusCheck(user.accountId);


    await validPassword(req.body.password, user.password);
    await userStatusCheck(user);
    await User.update(
      { email: user.email },
      {
        loginDate: new Date(),
        refreshToken: req.token.refreshToken,
      },
    );

    res.cookie('email', user.email);
    res.cookie('name', user.name);
    res.cookie('role', user.type);
    res.cookie('account', user.accountId);
   // res.redirect('/');
    res.end();
  } catch (err) {
    next(err);
  }
};

const forgotPassControl = async (req, res , next) => {
  try {
    const user = await userExist(req.body.email);
    if (!user) throw new httpError(404,'user not exist');

    await userStatusCheck(user);

    const newPass = generatePassword();
    const hashedPassword = await bcrypt.hash(newPass, 12);
    await sendEmailPassword(newPass, user);
    await User.update(
      { email: user.email },
      { password: hashedPassword },
    );

    return res.status(200)
      .json({ message: 'A new password has been sent to the email' });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginControl, forgotPassControl };
