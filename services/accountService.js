const accountRepository = require('../repositories/account.repositories');
const { sendEmail } = require('../sendEmail/sendEmail');
const { User } = require('./authService');

const Account = new accountRepository();

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

const inviteAuthorization = (account, invitedUser) => {
  if (account._id.toString() === invitedUser.accountId) throw new Error('User already in the account');
  if (account.role === 'admin') throw new Error('Cant add Admins to an account');
  if (account.plan !== 'free') throw new Error('User already in an Account');
  if (account.role !== 'user') throw new Error('User already in an Account');
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
  Account, sendInvitation, inviteAuthorization, createUserToAccount,
};
