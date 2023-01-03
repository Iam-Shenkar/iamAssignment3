const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const OTPRepository = require('../repositories/oneTimePass.repositories');
const { typeUser } = require('../middleware/validatorService');
const { sendEmail } = require('../sendEmail/sendEmail');
const { httpError } = require('../classes/httpError');

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
  if (!newOneTimePass) throw new httpError(400,'No new OTP created');
  return newOneTimePass;
};

const deleteFormOTP = async (data) => {
  const email = data.toLowerCase();
  if (await existCode(email)) {
    const deletedOTP = await oneTimePass.delete({ email });
    if (!deletedOTP) throw new httpError(400, 'Failed to delete OTP');
  }
};

const existCode = async (email) => {
  const userEmail = email.toLowerCase();
  const userCode = await oneTimePass.retrieve(userEmail);
  if (!userCode) throw new httpError(400, 'Unable to find OTP');
  return userCode;
};

const otpCompare = async (UserCode, userCode) => {
  if (userCode !== UserCode) throw new httpError(412, 'Incorrect code');
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

const createUser = async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
  const domain = typeUser(user.email);
  const newUser = {
    name: user.name,
    email: user.email,
    password: user.password,
    type: domain,
  };
  User.create(newUser);
  if(!newUser) throw new httpError(400,'failed to add new user');
};

const codeTime = async (user, timeCode) => {
  const time = Math.abs(new Date().getMinutes() - user.creationDate.getMinutes());
  if (time < timeCode) return true;
};

const createAccount = async (email) => {
  await Account.create({ name: email });
  const account = await Account.retrieve({ name: email });
  if (!account) throw new httpError(400,"failed to find account");
  return account._id.toString();
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
