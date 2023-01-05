const assetsService = require('../services/assetsService');
const authService = require('../services/authService');
const accountService = require('../services/accountService');
const { httpError } = require('../class/httpError');

const verifyToken = (req,res) => {
  const user = req.user;
  res.status(200).json({
    message: 'User is approved',
    data: user.email
  });
}

const getAllAssets = async (req, res, next) => {
  try {
    const user = authService.userExist(req.user.email);
    if (!user) {
      throw new httpError(404,"user doesn't exist");
    }
    const account = user.accountId;
    const assets = await accountService.Account.retrieve({ _id: account });
    if(!assets) throw new httpError(400,'could not find assets')
  } catch (err) {
    next(err);
  }
  res.send(assets);
};

const isFeatureAllowed = async (req, res , next) => {
  try {
    const result = await assetsService.getFeatures(req.user.email);
    if(!result) throw new httpError(400,'could not find assets');
    res.status(result.status)
      .json(result.message || result.data);
  } catch (err) {
   next(err);
  }
};

const getSeats = async (req, res, next) => {
  try {
    const result = await assetsService.getSeats(req.user.email);
    if(!result) throw new httpError(400,'could not find assets');
    res.status(result.status).json(result.message || result.data);
  } catch (err) {
    next(err);
  }
};

const getCredit = async (req, res, next) => {
  try {
    const result = await assetsService.getCredit(req.user.email);
    if(!result) throw new httpError(400,'could not find assets');
    res.status(result.status).json(result.message || result.data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  isFeatureAllowed,
  getSeats,
  getCredit,
  getAllAssets,
  verifyToken,
};
