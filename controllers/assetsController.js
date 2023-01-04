const assetsService = require('../services/assetsService');
const authService = require('../services/authService');
const accountService = require('../services/accountService');

const verifyToken = (req,res)=>{
  const user = req.user;
  res.status(200).json({
    message: 'User is approved',
    data: user.email
  });
}

const getAllAssets = async (req, res) => {
  try {
    const user = authService.userExist(req.user.email);
    if (!user) {
      throw new Error("user doesn't exist");
    }
    const account = user.accountId;
    const assets = await accountService.Account.retrieve({ _id: account });
  } catch (err) {
    res.status(401).json('could not find assets');
  }
  res.send(assets);
};

const isFeatureAllowed = async (req, res) => {
  try {
    const result = await assetsService.getFeatures(req.user.email);
    res.status(result.status)
      .json(result.message || result.data);
  } catch (err) {
    res.status(401).json('could not find assets');
  }
};

const getSeats = async (req, res) => {
  try {
    const result = await assetsService.getSeats(req.user.email);
    res.status(result.status).json(result.message || result.data);
  } catch (err) {
    res.status(401).json('could not find assets');
  }
};

const getCredit = async (req, res) => {
  try {
    const result = await assetsService.getCredit(req.user.email);
    res.status(result.status).json(result.message || result.data);
  } catch (err) {
    res.status(401).json('could not find assets');
  }
};

module.exports = {
  isFeatureAllowed,
  getSeats,
  getCredit,
  getAllAssets,
  verifyToken,
};
