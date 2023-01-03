const mailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const { User } = require('../services/authService');
const { httpError } = require('../classes/httpError');

const schema = new passwordValidator();

const PasswordValidator = (password) => {
  const notValid = schema.validate(password, { details: true });
  if (notValid.length > 0) throw new httpError(400, `${notValid[0].message}`);
};

const emailValidator = (email) => {
  if (!mailValidator.validate(email)) throw new httpError(412, 'Invalid Email');
};

const typeValidator = (userType) => {
  const type = userType.toLowerCase();
  const validType = ['user', 'admin', 'manager'];
  if (!validType.find((element) => element === type)) throw new httpError(412, 'Invalid type');
};

const statusValidator = (status) => {
  const validStatus = ['active', 'closed', 'suspended'];
  if (!validStatus.find((element) => element === status)) throw new httpError(412, 'Invalid status');
};

const suspensionTimeValidator = (suspensionTime) => {
  if (!(/^\d+$/.test(suspensionTime))) throw new httpError(412, 'Invalid suspension time');
};

const nameValidator = (name) => {
  if (name === '' || !name) throw new httpError(412, 'Name required');
};

const userRole = (email) => {
  let domain = email.split('@');
  domain = domain[1].split('.');
  if (domain.find((element) => element === process.env.adminEmail)) {
    return 'admin';
  }
  return 'manager';
};

const codeValidator = (code) => {
  if (code.length !== 6) throw new httpError(412, 'Code length must be at least 6 characters');
};

const checkPermission = async (req, res, next) => {
  try {
    const user = await User.retrieve(req.body.mail);
    if(!user) throw new httpError(404,'user not exists');
    if (user.type === 'user') throw new httpError(401, 'Not authorized');
    // check sit
    next();
  } catch(err) {
    next(err);
  }
};

const checkPermissionAdmin = async (req, res, next) => {
  try {
    const user = await User.retrieve(req.body.mail);
    if(!user) throw new httpError(404,'user not exists');

    if (user.type === 'user' || user.type === 'manager') throw new httpError(401,'Not authorized');
  // check sit
  next();
  } catch (err) {
    next(err);
  }
};


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
  statusValidator,
  typeValidator,
  codeValidator,
  nameValidator,
  emailValidator,
  PasswordValidator,
  userRole,
  checkPermission,
  checkPermissionAdmin,
};
