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
    res.status(401);
  }
  res.send(assets);
};

const isFeatureAllowed = async (req, res) => {
  try {
    const result = await assetsService.getFeatures(req.user.email);
    res.status(result.status)
      .json(result.data);
  } catch (err) {
    res.status(401);
  }
};

const getSeats = async (req, res) => {
  try {
    const result = await assetsService.getSeats(req.user.email);
    res.status(result.status).json(רesult.data);
  } catch (err) {
    res.status(401);
  }
};

const getCredit = async (req, res) => {
  try {
    const result = await assetsService.getCredit(req.user.email);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(401);
  }
};

const setCredit = async (req, res) => {
  try {
    const result = await assetsService.setCredit(req.user.email, req.params.credit);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(401);
  }
};

const setSeats = async (req, res) => {
  try {
    const result = await assetsService.setSeats(req.user.email, req.params.seat);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(401);
  }
};

const setFeature = async (req, res) => {
  try {
    const result = await assetsService.setFeature(req.user.email,req.params.feature);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(401);
  }
};

module.exports = {
  isFeatureAllowed,
  getSeats,
  getCredit,
  getAllAssets,
  verifyToken,
  setFeature,
  setCredit,
  setSeats,
};
