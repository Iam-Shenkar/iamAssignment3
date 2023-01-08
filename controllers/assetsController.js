const assetsService = require('../services/assetsService');
const authService = require('../services/authService');
const accountService = require('../services/accountService');
const { httpError } = require('../class/httpError');

const verifyToken = (req, res) => {
  const { user } = req;
  res.status(200).json({
    message: 'User is approved',
    accountId: user.accountId,
  });
};

const getAllAssets = async (req, res, next) => {
  try {
    const account = authService.userExist(req.user.accountId);
    if (!accountId) {
      throw new httpError(400, "account doesn't exist");
    }
    const assets = await accountService.Account.retrieve({ _id: account._id });
    if (!assets) throw new httpError(400, `could not find assets in ${account.name}`);
    res.send(assets);
  } catch (err) {
    next(err);
  }
};

const coreDetails = async  (req, res, next) => {
  try {
    const result = await assetsService.coreDetails(req.user);
    if (!result) throw new httpError(400, 'could not find assets');
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const getFeatures = async (req, res, next) => {
  try {
    const result = await assetsService.getFeatures(req.user.accountId);
    if (!result) throw new httpError(400, 'could not find features');
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const getSeats = async (req, res, next) => {
  try {
    const result = await assetsService.getSeats(req.user.accountId);
    if (!result) throw new httpError(400, 'could not find seats');
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const getCredit = async (req, res, next) => {
  try {
    const result = await assetsService.getCredit(req.user.accountId);
    if (!result) throw new httpError(400, 'could not find credits');
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const setCredit = async (req, res, next) => {
  try {
    const result = await assetsService.setCredit(req.user.accountId, req.params.credit);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const setSeats = async (req, res, next) => {
  try {
    const result = await assetsService.setSeats(req.user.accountId, req.params.seat);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const setFeature = async (req, res, next) => {
  try {
    const result = await assetsService.setFeature(req.user.accountId, req.params.feature);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFeatures,
  getSeats,
  getCredit,
  getAllAssets,
  verifyToken,
  setFeature,
  setCredit,
  setSeats,
  coreDetails,
};
