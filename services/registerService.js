const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const OTPRepository = require('../repositories/oneTimePass.repositories');
const { userRole } = require('../middleware/validatorService');
const { sendEmail } = require('../sendEmail/sendEmail');

const { User } = require('./authService');
const { Account } = require('./accountService');

const oneTimePass = new OTPRepository();

const createOneTimePass = async (email) => {
  const sendCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const newOneTimePass = { email, code: sendCode, creationDate: new Date() };
  await oneTimePass.create(newOneTimePass);
  return newOneTimePass;
};

const deleteFormOTP = async (data) => {
  const email = data.toLowerCase();
  if (await existCode(email)) {
    await oneTimePass.delete({ email });
  }
};

const existCode = async (email) => {
  const userEmail = email.toLowerCase();
  const userCode = await oneTimePass.retrieve({ email: userEmail });
  return userCode;
};

const otpCompare = async (UserCode, userCode) => {
  if (userCode !== UserCode) throw new Error('Incorrect code');
};

const sendEmailOneTimePass = async (user, newCode) => {
  const mailData = {
    path: '/sendEmail/oneTimePass.ejs',
    subject: 'Please Verify you Account',
    email: user.email,
  };
  const details = {
    name: `${user.name}`,
    code: `${newCode.code}`,
  };
  await sendEmail(mailData, details);
};

const createUser = async (user, accountID) => {
  const hashPassword = await bcrypt.hash(user.password, 12);
  const newUser = {
    name: user.name,
    email: user.email,
    accountId: accountID,
    password: hashPassword,
  };
  await User.create(newUser);
};

const codeTime = async (user, timeCode) => {
  const time = Math.abs(new Date().getMinutes() - user.creationDate.getMinutes());
  if (time < timeCode) return true;
};

const createAccount = async (email) => {
  await Account.create({ name: email });
  return Account.retrieve({ name: email });
};

module.exports = {
  codeTime,
  sendEmailOneTimePass,
  createUser,
  otpCompare,
  deleteFormOTP,
  existCode,
  createOneTimePass,
  createAccount,
};
