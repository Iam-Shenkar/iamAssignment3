const mailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const { httpError } = require('../classes/httpError');

const schema = new passwordValidator();

const PasswordValidator = (password) => {
  const notValid = schema.validate(password, { details: true });
  if (notValid.length > 0) throw new httpError(400, `${notValid[0].message}`);
};

const emailValidator = (email) => {
  if (!mailValidator.validate(email)) throw new httpError(400, 'Invalid Email');
};

const typeValidator = (userType) => {
  const type = userType.toLowerCase();
  const validType = ['user', 'admin', 'manager'];
  if (!validType.find((element) => element === type)) throw new httpError(400, 'Invalid type');
};

const statusValidator = (status) => {
  const validStatus = ['active', 'closed', 'suspended'];
  if (!validStatus.find((element) => element === status)) throw new httpError(400, 'Invalid status');
};

const suspensionTimeValidator = (suspensionTime) => {
  if (!(/^\d+$/.test(suspensionTime))) throw new httpError(400, 'Invalid suspension time');
};

const nameValidator = (name) => {
  if (name === '' || !name) throw new httpError(400, 'Name required');
};

const typeUser = (email) => {
  let domain = email.split('@');
  domain = domain[1].split('.');
  if (domain.find((element) => element === process.env.adminEmail)) {
    return 'admin';
  }
  return 'user';
};

const codeValidator = (code) => {
  if (code.length !== 6) throw new httpError(400, 'Code length must be at least 6 characters');
};

function generateAccessToken(email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(email) {
  return jwt.sign(email, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
}

schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces(); // Should not have spaces

module.exports = {
  suspensionTimeValidator,
  generateAccessToken,
  generateRefreshToken,
  statusValidator,
  typeValidator,
  codeValidator,
  nameValidator,
  emailValidator,
  PasswordValidator,
  typeUser,
};
