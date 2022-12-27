const { Account } = require('../services/accountService');

const addUser = async (req, res) => {
  res.status(200).json({ message: 'add account' });
};

module.exports = { addUser, Account };
