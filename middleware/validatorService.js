const mailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const { User } = require('../repositories/repositories.init');

const schema = new passwordValidator();

const PasswordValidator = (password) => {
  const notValid = schema.validate(password, { details: true });
  if (notValid.length > 0) throw new Error(notValid[0].message);
};

const emailValidator = (email) => {
  if (!mailValidator.validate(email)) throw new Error('email not valid');
};

const typeValidator = (userType) => {
  const type = userType.toLowerCase();
  const validType = ['user', 'admin', 'manager'];
  if (!validType.find((element) => element === type)) throw new Error('type not valid');
};

const statusValidator = (status) => {
  const validStatus = ['active', 'closed', 'suspended'];
  if (!validStatus.find((element) => element === status)) throw new Error('status not valid');
};

const suspensionTimeValidator = (suspensionTime) => {
  if (!(/^\d+$/.test(suspensionTime))) throw new Error('suspensionTime not valid');
};

const nameValidator = (name) => {
  if (name === '') throw new Error('name not valid');
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
  if (code.length !== 6) throw new Error('code not valid');
};

const checkPermission = async (req, res, next) => {
  const { user } = req;
  if (user.type === 'user') res.status(401);
  next();
};

const checkPermissionAdmin = async (req, res, next) => {
  const { user } = req;
  if (user.type === 'user' || user.type === 'manager') res.status(401);
  next();
};

schema
  .is().min(8) // Minimum length 8
  .is().max(100) // Maximum length 100
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
