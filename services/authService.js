const bcrypt = require('bcrypt');
const generator = require('generate-password');
const { httpError } = require('../class/httpError');
const UsersRepository = require('../repositories/users.repositories');
const { sendEmail } = require('../sendEmail/sendEmail');
const { Account } = require('./accountService');



const User = new UsersRepository();

const unSuspend = async (user) => {
  const updatedUser = await User.update(user.email, {
    status: 'active',
    suspensionTime: 0,
    suspensionDate: 0,
  });
  if (!updatedUser) throw new httpError(400, 'not Updated');
};

const validPassword = async (pass, userPassword) => {
  if (!await bcrypt.compare(pass, userPassword)) throw new httpError(400, 'incorrect password');
};

const userExist = async (email) => {
  const userEmail = email.toLowerCase();
  const user = await User.retrieve({ email: userEmail });
  if (!user) return null;
  return user;
};
const accountStatusCheck = async (accountId) => {
  const account = await Account.retrieve(accountId);
  if (account.status !== 'active') throw new httpError(400, `Account is ${account.status}`);
};

const userStatusCheck = async (user) => {
  switch (user.status) {
    case 'active':
      break;
    case 'closed':
      throw new httpError(400, 'User is closed');

    case 'suspended':
      const suspendTime = parseInt(user.suspensionTime, 10);
      const suspendStartDate = user.suspensionDate;
      const dateExpired = suspendStartDate;

      dateExpired.setDate(suspendStartDate.getDate() + suspendTime);
      if (dateExpired > new Date()) {
        console.log(`user: ${user.email} is suspended- login failed`, 'ERROR');
        throw new httpError(400, `User is suspended until ${dateExpired}`);
      } else {
        await unSuspend(user);
      }
      break;
    default:
  }
};

const generatePassword = () => {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  return password;
};

const sendEmailPassword = async (newPass, user) => {
  const mailData = {
    path: '/sendEmail/newPassMail.ejs',
    subject: 'New Password',
    email: user.email,
  };
  const details = {
    name: `${user.name}`,
    pass: `${newPass}`,
  };
  await sendEmail(mailData, details);
};

module.exports = {
  userStatusCheck,
  accountStatusCheck,
  userExist,
  validPassword,
  generatePassword,
  sendEmailPassword,
  User,
};
