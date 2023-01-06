const { Account, User } = require('../repositories/repositories.init');
const { httpError } = require('../class/httpError');
const { updateName, adminUpdateUser } = require('../services/userService');

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
    if (!account) throw new httpError(400, 'Cant delete this user');
    if (account.plan === 'free') {
      await Account.update({ _id: account._id }, { status: 'closed' });
      await User.update({ email: user.email }, { status: 'closed' });
    } else if (user.role !== 'user') {
      throw new Error('Unable to delete this user');
    } else {
      await User.delete({ email: user.email });
    }
    return res.status(200).json({ message: 'The user has been deleted' });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getUsers, getUser, deleteUser, updateUser,
};
