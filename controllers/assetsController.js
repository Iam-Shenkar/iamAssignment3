const assetsService = require('../services/assetsService');

const isFeatureAllowed = (res, req) => {
  const result = assetsService.genericAsset('features', req);
  res.status(result.status).json(result.message || result.data);
};

const getSeats = (res, req) => {
  const result = assetsService.genericAsset('seats', req);
  res.status(result.status).json(result.message || result.data);
};

const getCredit = (res, req) => {
  const result = assetsService.genericAsset('credits', req);
  res.status(result.status).json(result.message || result.data);
};

const getUser = (res, req) => {

};

module.exports = {
  isFeatureAllowed,
  getSeats,
  getCredit,
  getUser,
  genericAsset,
};
