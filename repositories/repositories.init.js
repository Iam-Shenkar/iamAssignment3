const UsersRepository = require('./users.repositories');
const accountRepository = require('./account.repositories');
const OTPRepository = require('./oneTimePass.repositories');

const oneTimePass = new OTPRepository();
const User = new UsersRepository();
const Account = new accountRepository();

module.exports = { oneTimePass, User, Account };
