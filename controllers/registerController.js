const bcrypt = require('bcrypt');
const register = require('../services/registerService');
const { User, userExist } = require('../services/authService');
const { existCode, sendEmailOneTimePass, createAccount } = require('../services/registerService');
const { Account } = require('../services/accountService');
const { httpError } = require('../classes/httpError');


const handleRegister = async (req, res, next) => {
  try {
    const newUser = req.body;
    const user = await userExist(newUser.email);
    if (user) {
      if (user.status !== 'pending') throw new httpError(400,'user exist');
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
  } catch (err) {
    next(err);
  }
};

const handleConfirmCode = async (req, res, next) => {
  try {
    // userExist -> returns null if not found, else returns user
    const user = await userExist(req.body.email);
    if (user) throw new httpError(400,'user already exist');

    const oneTimePassRecord = await existCode(req.body.email);
    await register.otpCompare(req.body.code, oneTimePassRecord.code);
    const accountId = await createAccount(req.body.email);
    await register.createUser(req.body, accountId);
    return res.status(200)
        .json({ message: 'User was added' });
  } catch (e) {
    next(e);
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

      res.sendFile('homePage.html');
    } else {
      res.sendFile('./register');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { handleRegister, handleConfirmCode, confirmationUser };

