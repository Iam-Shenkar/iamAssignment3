const { User, userExist } = require('../services/authService');
const { Account } = require('../services/accountService');
const { oneTimePass, createAccount, createUser } = require('../services/registerService');
const { userRole } = require('../middleware/validatorService');

async function addUser(req, res) {
  try {
    const user = await userExist(req.body.email);
    if (user) throw new Error('user  already exists');

    const accountID = await createAccount(req.body.email);
    await createUser(req.body, accountID);

    return res.status(200)
      .json({ message: 'User was added' });
  } catch (e) {
    return res.status(402)
      .json({ message: e.message });
  }
}

async function getUsers(req, res) {
  try {
    // const user = await User.retrieve({ email: req.user });
    // if(user.type !==)
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
    res.status(400).json({ message: err.message });
  }
}

async function getUser(req, res) {
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
    res.status(400).json({ message: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const userType = await User.retrieve({ email: req.body.email });
    if (userType.type === 'admin' && req.body.status !== 'active') {
      await User.update({ email: req.body.email }, { data: req.body, loginDate: new Date() });
    } else if (userType.type === 'admin' && req.body.status === 'active') {
      await User.update({ email: req.body.email }, { data: req.body });
    } else {
      await User.update({ email: req.body.email }, { name: req.body.name });
    }
    return res.status(200).json({ message: 'user update' });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const planCheck = await Account.retrieve({ email: req.body.email });
    if (planCheck.plan === 'free') {
      await Account.delete({ email: req.body.email });
    }
    await oneTimePass.delete({ email: req.body.email });
    return res.status(200).json({ message: 'The user has been deleted' });
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
}

module.exports = {
  addUser, getUsers, getUser, deleteUser, updateUser,
};
