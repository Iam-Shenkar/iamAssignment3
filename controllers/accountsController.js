const { Account, sendInvitation, checkPermission } = require('../services/accountService');
const { User } = require('../services/authService');

const inviteUser = async (req, res) => {
  try {
    checkPermission(req.user);
    const account = await Account.retrieve({ _id: req.user.accountId });

    const invitedUser = await User.retrieve({ email: req.params.email });

    if (invitedUser) {
      // if (account._id.toString() === invitedUser.accountId) throw new Error('nooooooooo');
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
      await sendInvitation(req.user, newUser);
    }
    res.status(200).json({ message: 'user invited' });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getAccount = async (req, res) => {
  const user = await User.retrieve({ email: req.params.email });
  if (!user) throw new Error(' no');
  const acc = await Account.retrieve({ _id: user.accountId });
  const users = await User.find({ accountId: user.accountId });
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
  const { features } = acc.assets;
  outputArray.unshift({
    Plan: acc.plan, Seats: acc.assets.seats, Credits: acc.assets.credits, Features: features,
  });
  res.status(200).json(outputArray);
};

const editAccount = async (req, res) => {};
const getAccounts = async (req, res) => {};
const disableAccount = async (req, res) => {};

module.exports = {
  inviteUser, Account, getAccount, getAccounts, editAccount, disableAccount,
};
