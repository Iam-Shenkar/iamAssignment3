const assetsService = require('../services/assetsService');
const authService = require('../services/authService');
const accountService = require('../services/accountService');

const getAllAssets = async (req, res) => {
  const user = authService.userExist(req.user.email);
  if (!user) {
    throw new Error("user doesn't exist");
  }
  const account = user.accountId;
  const assets = await accountService.Account.retrieve({ _id: account });
  res.send(assets);
};

const isFeatureAllowed = async (req, res) => {
  const result = await assetsService.getFeatures(req);
  res.status(result.status).json(result.message || result.data);
};

const getSeats = async (req, res) => {
  const result = await assetsService.getSeats(req);
  res.status(result.status).json(result.message || result.data);
};

const getCredit = async (req, res) => {
  const result = await assetsService.getCredit(req);
  res.status(result.status).json(result.message || result.data);
};

module.exports = {
  isFeatureAllowed,
  getSeats,
  getCredit,
  getAllAssets,
};
