const bcrypt = require('bcrypt');
const generator = require('generate-password');
const { httpError } = require('../class/httpError');
const { sendEmail } = require('../sendEmail/sendEmail');
const { Account, User } = require('../repositories/repositories.init');

const unSuspend = async (object, val) => {
  const model = val === 'user' ? User : Account;
  await model.update(object._id, {
    status: 'active',
    suspensionTime: 0,
    suspensionDate: 0,
  });
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
  const account = await Account.retrieve({ _id: accountId });
  await statusCheck(account, 'account');
};

const statusCheck = async (object, model) => {
  switch (object.status) {
    case 'active':
      break;
    case 'closed':
      throw new httpError(403, 'User is closed');

    case 'suspended':
      const suspendTime = object.suspensionTime;
      const suspendStartDate = object.suspensionDate;
      const dateExpired = suspendStartDate;
      dateExpired.setDate(suspendStartDate.getDate() + suspendTime);
      if (dateExpired > new Date()) {
        throw new httpError(403, `${model} ${object.name} is suspended until ${dateExpired}`);
      } else {
        await unSuspend(object, model);
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
  statusCheck,
  userExist,
  validPassword,
  generatePassword,
  sendEmailPassword,
  accountStatusCheck,
  User,
};
