const {
  Account, sendInvitation, inviteAuthorization, inviteNewUser,
} = require('../services/accountService');
const { User } = require('../services/authService');
const { getSeats, setSeats } = require('../services/assetsService');

const inviteUser = async (req, res) => {
  try {
    const manager = req.user;
    const { accountId, userEmail } = req.req.params;
    const account = await Account.retrieve({ _id: accountId });
    const invitedUser = await User.retrieve({ email: userEmail });
    if ((await getSeats(account.name)).data < 1) throw new Error('There is not enough seats');

    if (invitedUser) {
      inviteAuthorization(account, invitedUser);
      await sendInvitation(manager, invitedUser);
    } else {
      await inviteNewUser(manager, userEmail);
    }
    await setSeats(account.name, manager.type, 1);
    res.status(200).json({ message: 'user invited' });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getAccount = async (req, res) => {
  try {
    if (req.params.accountId === 'none') throw new Error('The admin does not have an account');
    const acc = await Account.retrieve({ _id: req.params.accountId });
    const users = await User.find({ accountId: req.params.accountId });
    const outputArray = users.reduce((accumulator, currentValue) => [...accumulator,
      {
        Name: currentValue.name,
        email: currentValue.email,
        Role: currentValue.type,
        Status: currentValue.status,
        Gender: currentValue.gender,
        Edit: '',
      }], []);
    const { features } = acc.assets;
    outputArray.unshift({
      Plan: acc.plan, Seats: acc.assets.seats, Credits: acc.assets.credits, Features: features,
    });
    res.status(200).json(outputArray);
  } catch (err) {
    res.status(401).json({ message: 'The admin does not have an account' });
  }
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
  try {
    if (!req.body.name) throw new Error('Please choose Account');
    const acc = Account.find({ name: req.body.name });
    User.deleteMany({ accountId: acc._id });
    Account.update({ _id: acc._id }, { status: 'closed' });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  inviteUser, Account, getAccount, getAccounts, editAccount, disableAccount,
};
