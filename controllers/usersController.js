const { User } = require('../services/authService');
const { Account } = require('../services/accountService');
const { oneTimePass, createAccount, createUser } = require('../services/registerService');

async function handleAddUser(req, res) {
  try {
    const accountID = await createAccount(req.body.email);
    await createUser(req.body, accountID);
    return res.status(200)
      .json({ message: 'User was added' });
  } catch (e) {
    return res.status(401)
      .json({ message: e.message });
  }
}

async function handleGetUsers(req, res) {

  // const showAllUser = await User.find({});
  //
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
}

async function handleGetUser(req, res) {
  const user = await User.retrieve({ email: req.params.email });
  return res.send(JSON.stringify(user));
}

async function handleUpdateUser(req, res) {
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

async function handleDeleteUser(req, res) {
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
  handleAddUser, handleGetUsers, handleGetUser, handleDeleteUser, handleUpdateUser,
};
