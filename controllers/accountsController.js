const {
  Account, sendInvitation, inviteAuthorization, inviteNewUser,
} = require('../services/accountService');
const { User } = require('../services/authService');
const { getSeats, setSeats, setCredit ,setFeature } = require('../services/assetsService');
const { httpError } = require('../class/httpError');

const inviteUser = async (req, res, next) => {
  try {
    const manager = req.user;
    const { accountId, userEmail } = req.req.params;
    const account = await Account.retrieve({ _id: accountId });
    const invitedUser = await User.retrieve({ email: userEmail });
    if ((await getSeats(account.name)).data < 1) throw new httpError(400,'There is not enough seats');

    if (invitedUser) {
      inviteAuthorization(account, invitedUser);
      await sendInvitation(manager, invitedUser);
    } else {
      await inviteNewUser(manager, userEmail);
    }
    await setSeats(account.name, manager.type, 1);
    res.status(200).json({ message: 'user invited' });
  } catch (err) {
    next(err);
  }
};

const getAccount = async (req, res , next) => {
  try {
    if (req.params.accountId === 'none') throw new httpError(404,'The admin does not have an account');
    const acc = await Account.retrieve({ _id: req.params.id });
    if(!acc) throw new httpError(404,"account doesnt exist");
    if(acc.status === 'closed') throw new httpError(400,"account disabled");

    const users = await User.find({ accountId: req.params.id });
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
    next(err);
  }
};

const getAccounts = async (req, res, next) => {
  try {
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
    res.status(200)
      .json(outputArray);
  } catch(err) {
    next(err);
  }
};

const editAccount = async (req, res, next) => {
    try {
      if (!req.body) throw new httpError(400,"bad Request");

      const account = await Account.retrieve({_id: req.params.id});
      if(!account)
        throw new httpError(404,"account doesnt exist");
      if(account.status === 'closed')
        throw new httpError(400,"disabled account");

      const { params: { id }, body } = req;
      if(req.body.features) {
        await Account.update({ _id: id },
          { $push: { "assets.features": req.body.features } });
      }

      const updatedAccount =   await Account.update({ _id: id }, {...body});
      if (!updatedAccount) throw new httpError(400,"Not updated");
      return res.status(200)
        .json({ message: "account updated!" });
    } catch (err) {
      next(err);
    }
  };

const disableAccount = async (req, res, next) => {
  try {
    if (!req.params) throw new httpError(400,'Bad request');

    const account = await Account.retrieve({_id: req.params.id});
    if(!account)
      throw new httpError(404,"account doesnt exist");
    if(account.status === 'closed')
      throw new httpError(400,"account already disabled");

    await User.deleteMany({ accountId: req.params.id });
    await Account.update({ _id: req.params.id }, { status: 'closed' });
    return res.status(200)
      .json({ message: "account disabled" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  inviteUser, Account, getAccount, getAccounts, editAccount, disableAccount,
};
