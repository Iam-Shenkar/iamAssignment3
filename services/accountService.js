const { sendEmail } = require('../sendEmail/sendEmail');
const { Account, User } = require('../repositories/repositories.init');
const { httpError } = require('../class/httpError');
const { newStatus2Q } = require('../Q/sender');

const sendInvitation = async (manager, user) => {
  const path = `${process.env.runningPath}/auth/${user.accountId}/users/${user.email}/confirmation`;
  const mailData = {
    path: '/sendEmail/invitationUser.ejs',
    subject: 'Please Verify you Account',
    email: user.email,
  };
  const details = {
    name: `${user.name}`,
    manager: `${manager.name}`,
    path: `${path}`,
  };
  await sendEmail(mailData, details);
};

const inviteNewUser = async (name, accountId, mail) => {
  try {
    const newUser = {
      email: mail,
      name: 'stranger',
      type: 'user',
      status: 'pending',
      accountId,
    };
    await User.create(newUser);
    await sendInvitation(name, newUser);
  } catch (err) {
    throw new httpError(400, 'failed to invite user');
  }
};

const inviteAuthorization = (account, invitedUser) => {
  if (account._id.toString() === invitedUser.accountId) throw new Error('User already in the account');
  if (account.type === 'admin') throw new httpError(400, 'Cant add Admins to an account');
  if (account.type === 'user') throw new httpError(400, 'User already in an Account');
  if (invitedUser.status !== 'active') throw new httpError(400, 'User is not active');
  if (account === null) throw new httpError(404, 'Account not found');
};

const editAuthorization = async (accountId) => {
  const acc = await Account.retrieve({ _id: accountId });
  if (!acc) throw new httpError(404, 'account doesnt exist');
  if (acc.status === 'closed') throw new httpError(400, 'account is closed!');
  return acc;
};

const isFeatureExists = async (accountId, feature) => {
  const acc = await Account.retrieve({ _id: accountId });
  const currentFeatures = acc.assets.features;
  const isExists = currentFeatures.includes(feature);
  return isExists;
};

const suspendAccount = async (acc, body) => {
  const data = {
    status: body.status,
    suspensionDate: new Date(),
    suspensionTime: body.suspensionTime,
  };
  const updatedAccount = await Account.update({ _id: acc._id }, { ...data });
  if (!updatedAccount) throw new httpError(400, 'Not updated');
  await User.updateMany({ accountId: acc._id }, { ...data });
  await newStatus2Q(acc._id, body.status);
};

const unSuspendAccount = async (acc, body) => {
  const data = {
    status: body.status,
    suspensionTime: 0,
  };
  const updatedAccount = await Account.update({ _id: acc._id }, { ...data });
  if (!updatedAccount) throw new httpError(400, 'Not updated');
  await User.updateMany({ accountId: acc._id }, { status: 'active' });
};

const createUserToAccount = async (email, account) => {
  const newUser = {
    email,
    name: 'stranger',
    type: 'user',
    status: 'pending',
    accountId: account._id.toString(),
  };
  await User.create(newUser);
  return newUser;
};


const updateWithFeatures = async (id, data, feature) => {
  await Account.update(
    { _id: id },
    { ...data, $push: { 'assets.features': feature } },
  );
};

const QUpdateAccount = async (msg) => {
  let updatedAccount;
  const isExists = await isFeatureExists(msg.accountId, msg.features);
  const data = {
    'assets.credits': msg.credits,
    'assets.seats': msg.seats,
    status: 'active',
  };
  if (!isExists) {
    await updateWithFeatures(msg.accountId, data, msg.features);
  } else {
    updatedAccount = await Account.update({ _id: msg.accountId }, { ...data });
    await User.updateMany({ accountId: msg.accountId }, { status: 'active' });
    if (!updatedAccount) throw new Error('update failed');
  }
};

const QSuspendAccount = async (msg) => {
  const data = {
    status: 'suspended',
    suspensionDate: new Date(),
    suspensionTime: 10000,
  };
  const updatedAccount = await Account.update({ _id: msg.accountId }, { ...data });
  if (!updatedAccount) throw new Error('failed to suspend account');
  await User.updateMany({ accountId: msg.accountId }, { ...data });
};

module.exports = {
  Account,
  sendInvitation,
  inviteAuthorization,
  createUserToAccount,
  inviteNewUser,
  editAuthorization,
  isFeatureExists,
  suspendAccount,
  unSuspendAccount,
  QUpdateAccount,
  QSuspendAccount,
  updateWithFeatures
};
