const bcrypt = require('bcrypt');
// eslint-disable-next-line import/no-unresolved
const register = require('../services/registerService');
const { User, userExist } = require('../services/authService');
const { existCode, sendEmailOneTimePass } = require('../services/registerService');
const { Account } = require('../services/accountService');
const { userRole } = require('../middleware/validatorService');

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
    if (userRole(newUser.email) !== 'admin') {
      await Account.create({ name: newUser.email });
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
    const userEmail = req.body.email;
    const user = await userExist(userEmail);
    if (user) throw new Error('user already exist');

    const oneTimePassRecord = await existCode(userEmail);
    await register.otpCompare(req.body.code, oneTimePassRecord.code);
    await register.createUser(req.body);

    if (userRole(userEmail) !== 'admin') {
      const account = await Account.retrieve({ name: userEmail });
      await Account.update({ accountId: account._id.toString() }, { status: 'active' });
      await User.update({ email: userEmail }, { accountId: account._id.toString(), status: 'active' });
    }

    console.log(`user ${userEmail} was added`);

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

    if (user.status === 'pending') {
      await User.update({ email }, { status: 'active' });
    } else if (user.status === 'active') {
      await Account.delete({ _id: user.accountId });
      await User.update({ email }, { accountId });
    } else {
      throw new Error('Unable to confirm this user');
    }

    res.redirect('/login');
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { handleRegister, handleConfirmCode, confirmationUser };
