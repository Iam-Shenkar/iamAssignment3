const { Account, sendInvitation, checkPermission } = require('../services/accountService');
const { User } = require('../services/authService');

const inviteUser = async (req, res) => {
  try {
    // checkPermission(req.user);
    const manager = await User.retrieve({ email: req.user });
    const account = await Account.retrieve({ _id: manager.accountId });
    const invitedUser = await User.retrieve({ email: req.params.email });
    if (invitedUser) {
      if (account._id.toString() === invitedUser.accountId) throw new Error('user alredy......');
      await sendInvitation(req.params.email, invitedUser);
    } else {
      const newUser = {
        email: req.params.email,
        name: 'stranger',
        type: 'user',
        status: 'pending',
        accountId: account._id.toString(),
      };
      await User.create(newUser);
      await sendInvitation(account.name, newUser);
    }
    res.status(200).json({ message: 'user invited' });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getAccount = async (req, res) => {
  const acc = await Account.retrieve({ _id: req.params.accountId });
  const users = await User.find({ accountId: req.params.accountId });
  const outputArray = users.reduce((accumulator, currentValue) => [
    ...accumulator,
    {
      Name: currentValue.name,
      email: currentValue.email,
      Role: currentValue.type,
      Status: currentValue.status,
      Gender: currentValue.gender,
      Edit: '',
    },
  ], []);
  const { features } = acc.assets;
  outputArray.unshift({
    Plan: acc.plan, Seats: acc.assets.seats, Credits: acc.assets.credits, Features: features,
  });
  res.status(200).json(outputArray);
};

const getAccounts = async (req, res) => {
  const accounts = await Account.find({});
  const outputArray = [];
  for (let i = 0; i < accounts.length; i += 1) {
    const account = {
      id: accounts[i]._id,
      Name: accounts[i].name,
      Plan: accounts[i].plan,
      Credits: accounts[i].assets.credits,
      Features: accounts[i].assets.features.length,
      Status: accounts[i].status,
      Edit: '',
    };
    outputArray.push(account);
  }
  res.status(200).json(outputArray);
};

const editAccount = async (req, res) => {
  if (!req.body.name) { res.status(401); }
  const acc = await Account.retrieve({ name: req.body.name });
  acc.plan = req.body.plan;
  acc.assets.credits = req.body.credits;
  try {
    if (acc.assets.seats - req.body.usedSeats < 0) { throw new Error('more users then account can handle'); }
  } catch (e) {
    res.status(400).json(e);
  }
  acc.assets.seats = req.body.seats;
  acc.assets.features = req.body.features;
  await Account.update({ _id: acc._id }, {
    plan: acc.plan,
    assets: {
      credits: acc.assets.credits,
      seats: acc.assets.seats,
      features: acc.assets.features,
    },
  });
  res.status(200).json('Account updated!');
};

const disableAccount = async (req, res) => {
  if (!req.body.name) { res.status(401); }
  const acc = Account.find({ name: req.body.name });
  const users = User.find({ accountId: acc._id });
  // users.i;
};

module.exports = {
  inviteUser, Account, getAccount, getAccounts, editAccount, disableAccount,
};
