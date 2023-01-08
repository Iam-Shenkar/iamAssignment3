const bcrypt = require('bcrypt');
const register = require('../services/registerService');
const { userExist } = require('../services/authService');
const { existCode, sendEmailOneTimePass } = require('../services/registerService');
const { userRole } = require('../middleware/validatorService');
const { httpError } = require('../class/httpError');
const { freePlan2Q } = require('../Q/sender');
const { Account, User } = require('../repositories/repositories.init');
const { setSeats } = require('../services/assetsService');

const handleRegister = async (req, res, next) => {
  try {
    const newUser = req.body;
    const user = await userExist(newUser.email);
    if (user) {
      if (user.status !== 'pending') throw new httpError(400, 'user already exist');
      const newPass = await bcrypt.hash(req.body.password, 12);
      await User.update({ email: user.email }, {
        status: 'active',
        name: req.body.name,
        password: newPass,
      });

      return res.status(200)
        .json({ message: 'user update' });
    }
    if (userRole(newUser.email) !== 'admin') {
      await Account.create({ name: newUser.email });
    }
    await register.deleteFormOTP(newUser.email);
    const newOneTimePass = await register.createOneTimePass(newUser.email);
    await sendEmailOneTimePass(newUser, newOneTimePass);

    return res.status(200)
      .json({ message: 'code has been sent' });
  } catch (e) {
    next(e);
  }
};

const handleConfirmCode = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const user = await userExist(userEmail);
    if (user) throw new httpError(400, 'user already exist');

    const oneTimePassRecord = await existCode(userEmail);
    await register.otpCompare(req.body.code, oneTimePassRecord.code);
    await register.createUser(req.body);

    if (userRole(userEmail) !== 'admin') {
      const account = await Account.retrieve({ name: userEmail });
      await Account.update({ accountId: account._id.toString() }, { status: 'active' });
      await freePlan2Q(account._id.toString());
      await User.update({ email: userEmail }, { accountId: account._id.toString(), status: 'active' });
    }

    res.status(200)
      .json({ message: 'User was added' });
  } catch (e) {
    next(e);
  }
};

const confirmationUser = async (req, res, next) => {
  try {
    const { email, accountId } = req.params;
    const user = await userExist(email);

    if (user.status === 'active') {
      await Account.delete({ _id: user.accountId });
      await User.update({ email }, { accountId });
      await setSeats(accountId, 1);
    } else if (user.status !== 'pending') {
      throw new httpError(401, 'Unable to confirm this user');
    }

    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

module.exports = { handleRegister, handleConfirmCode, confirmationUser };
