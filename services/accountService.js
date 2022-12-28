const accountRepository = require('../repositories/account.repositories');
const { sendEmail } = require('../sendEmail/sendEmail');

const Account = new accountRepository();

const sendInvitation = async (manager, user) => {
  const path = `http://localhost:5000/auth/${user.accountId}/users/${user.email}/confirmation`;
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
const checkPermission = (user) => {
  if (user.type === 'user') throw new Error('Not authorized');
  // check sit
};

module.exports = {
  Account, sendInvitation, checkPermission,
};
