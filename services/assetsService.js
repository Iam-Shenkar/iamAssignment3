const authService = require('./authService');
const accountService = require('./accountService');

const getAssetsByUser = async (email) => {
  const user = authService.userExist(email);
  if (!user) {
    throw new Error("user doesn't exist");
  }
  const account = user.accountId;
  const assets = await accountService.Account.retrieve({ _id: account });
  return assets;
};

const checkFeatures = (assets, currentAsset, params) => {
  const isFeatureExists = currentAsset.filter(params);
  let result;
  if (isFeatureExists) {
    result = { status: 200, message: `OK, feature ${params} exists and available`, data: params };
  } else {
    result = { status: 200, message: `No s feature ${params} doesn't exist`, data: 0 };
  }
  return result;
};

const genericAsset = (wantedAsset, req) => {
  const assets = getAssetsByUser(req.user.email);
  const currentAsset = assets.wantedAsset;
  let result;
  if (wantedAsset === 'features') {
    result = checkFeatures(assets, currentAsset, req.params);
  } else {
    const remainAsset = currentAsset - req.params;
    if (remainAsset < 0) {
      result = { status: 200, message: `OK, remain ${wantedAsset}: ${remainAsset}`, data: remainAsset };
      accountService.Account.update({ _id: req.user.accountId }, { wantedAsset: remainAsset });
    } else {
      result = { status: 200, message: `No seats  ${wantedAsset}`, data: 0 };
    }
  }
  return result;
};

module.exports = { getAssetsByUser, genericAsset };
