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
  const result = await assetsService.checkFeatures(req);
  res.status(result.status).json(result.message || result.data);
};

const getSeats = async (req, res) => {
  const result = await assetsService.seatsCheck(req);
  res.status(result.status).json(result.message || result.data);
};

const getCredit = async (req, res) => {
  const result = await assetsService.creditCheck(req);
  res.status(result.status).json(result.message || result.data);
};

const getUser = (req, res) => {

};

module.exports = {
  isFeatureAllowed,
  getSeats,
  getCredit,
  getUser,
  getAllAssets,
};
