const { sendEmail } = require('../sendEmail/sendEmail');
const { Account, User } = require('../repositories/repositories.init');
const { httpError } = require('../class/httpError');

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

const inviteNewUser = async (account, email) => {
  try {
    const newUser = {
      email,
      name: 'stranger',
      type: 'user',
      status: 'pending',
      accountId: account._id.toString(),
    };
    await User.create(newUser);
    await sendInvitation(account.name, newUser);
  } catch (err) {
    throw new httpError(400, 'failed to invite user');
  }
};

const inviteAuthorization = (account, invitedUser) => {
  if (account._id.toString() === invitedUser.accountId) throw new Error('User already in the account');
  if (account.role === 'admin') throw new httpError(400, 'Cant add Admins to an account');
  if (account.plan !== 'free') throw new httpError(400, 'User already in an Account');
  if (account.role !== 'user') throw new httpError(400, 'User already in an Account');
  if (invitedUser.status !== 'active') throw new httpError(400, 'User is not active');
  if (account === null) throw new httpError(404, 'Account not found');
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

module.exports = {
  Account, sendInvitation, inviteAuthorization, createUserToAccount, inviteNewUser,
};
