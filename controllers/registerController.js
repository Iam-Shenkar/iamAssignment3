const bcrypt = require('bcrypt');
const path = require('path');
const register = require('../services/registerService');
const { User, userExist } = require('../services/authService');
const { existCode, sendEmailOneTimePass, createAccount } = require('../services/registerService');
const { Account } = require('../services/accountService');

const handleRegister = async (req, res) => {
  try {
    const newUser = req.body;
    const user = await userExist(newUser.email);
    if (user) {
      if (user.status !== 'pending') throw new Error('user exist');
      const newPass = await bcrypt.hash(req.body.password, 12);
      await User.update({ email: user.email }, {
        status: 'active',
        name: req.body.name,
        password: newPass,
      });

      return res.status(200)
        .json({ message: 'user update' });
    }
    await register.deleteFormOTP(newUser.email);
    const newOneTimePass = await register.createOneTimePass(newUser.email);
    await sendEmailOneTimePass(newUser, newOneTimePass);
    return res.status(200)
      .json({ message: 'code has been sent' });
  } catch (e) {
    return res.status(401)
      .json({ message: e.message });
  }
};

const handleConfirmCode = async (req, res) => {
  try {
    const user = await userExist(req.body.email);
    if (user) throw new Error('user already exist');

    const oneTimePassRecord = await existCode(req.body.email);
    await register.otpCompare(req.body.code, oneTimePassRecord.code);
    const account = await createAccount(req.body.email);
    await register.createUser(req.body, account._id.toString());
    console.log(`user ${req.body.email} was added`);
    res.status(200)
      .json({ message: 'User was added' });
  } catch (e) {
    return res.status(401)
      .json({ message: e.message });
  }
};

const confirmationUser = async (req, res, next) => {
  try {
    const { email, accountId } = req.params;
    const user = await userExist(email);

    if (!user.status === 'pending') {
      await Account.delete({ _id: accountId });
      await User.update({ email }, { accountId, status: 'active' });
      // הורדת SIT

      res.redirect(`${process.env.runningPath}/homePage.html`);
    } else {
      res.redirect(`${process.env.runningPath}/index.html`);
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { handleRegister, handleConfirmCode, confirmationUser };
