const bcrypt = require('bcrypt');
const { Account, User } = require('../repositories/repositories.init');

const { updateName, adminUpdateUser, deleteAuthorization } = require('../services/userService');
const { validPassword } = require('../services/authService');
const { setSeatsAdmin } = require('../services/assetsService');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    const outputArray = users.reduce((accumulator, currentValue) => [
      ...accumulator,
      {
        Name: currentValue.name,
        email: currentValue.email,
        Role: currentValue.type,
        Status: currentValue.status,
        Edit: '',
      },
    ], []);
    res.status(200).json(outputArray);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    let accountName = 'none';
    const user = await User.retrieve({ email: req.params.email });
    if (user.type !== 'admin') {
      const account = await Account.retrieve({ _id: user.accountId });
      accountName = account.name;
    }
    const del = {
      name: user.name,
      email: user.email,
      role: user.type,
      gender: user.gender,
      status: user.status,
      account: accountName,
    };
    res.status(200).json(del);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { user } = req;
    const data = req.body;
    if (user.type !== 'admin') {
      await updateName(user, data);
    } else {
      await adminUpdateUser(data);
    }
    return res.status(200).json({ message: 'user update' });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.retrieve({ email: req.params.email });
    const account = await Account.retrieve({ _id: user.accountId });
    deleteAuthorization(user, account, req.user);

    if (account.plan === 'free' && user.type === 'manager') {
      await Account.update({ _id: account._id }, { status: 'closed' });
      await User.update({ email: user.email }, { status: 'closed' });
    } else {
      await User.delete({ email: user.email });
      await setSeatsAdmin(user.accountId, -1);
    }
    return res.status(200).json({ message: 'The user has been deleted' });
  } catch (e) {
    next(e);
  }
};

const updatePass = async (req, res, next) => {
  try {
    const user = await User.retrieve({ email: req.body.email });
    await validPassword(req.body.password, user.password);
    const newPass = await bcrypt.hash(req.body.newPassword, 12);
    await User.update({ email: user.email }, { password: newPass });
    res.status(200).json('Password Updated');
  } catch (e) {
    res.status(403).json(e.message);
  }
};
module.exports = {
  getUsers, getUser, deleteUser, updateUser, updatePass,
};
