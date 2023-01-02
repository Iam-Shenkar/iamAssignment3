const bcrypt = require('bcrypt');
const { userExist, statusCheck, validPassword } = require('../services/authService');
const { generatePassword, sendEmailPassword } = require('../services/authService');

const { User } = require('../services/authService');

const loginControl = async (req, res, next) => {
  try {
    const user = await userExist(req.body.email);
    if (!user) throw new Error('user not exist');

    await validPassword(req.body.password, user.password);
    await statusCheck(user);

    await User.update(
      { email: user.email },
      {
        loginDate: new Date(),
        refreshToken: req.token.refreshToken,
      },
    );

    res.status(200).json(user.email);
  } catch (err) {
    // redirect logout
    res.status(401).json({ message: err.message });
  }
};

const forgotPassControl = async (req, res) => {
  try {
    const user = await userExist(req.body.email);
    if (!user) throw new Error('user not exist');
    await statusCheck(user);
    const newPass = generatePassword();

    const hashedPassword = await bcrypt.hash(newPass, 12);
    await sendEmailPassword(newPass, user);
    await User.update(
      { email: user.email },
      { password: hashedPassword },
    );

    return res.status(200)
      .json({ message: 'A new password has been sent to the email' });
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
};

module.exports = { loginControl, forgotPassControl };
