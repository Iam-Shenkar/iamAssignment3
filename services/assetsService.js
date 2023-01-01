const authService = require('./authService');
const accountService = require('./accountService');

const getAccountByUser = async (email) => {
  const user = await authService.userExist(email);
  if (!user) {
    throw new Error("user doesn't exist");
  }
  const { accountId } = user;
  const account = await accountService.Account.retrieve({ _id: accountId });
  return account;
};

const getAssetsByUser = async (email) => {
  const account = await getAccountByUser(email);
  return account.assets;
};

const getFeatures = async (req) => {
  const { email } = req.params;
  const assets = await getAssetsByUser(email);
  const currentFeatures = assets.features;
  let result;
  if (currentFeatures) {
    result = { status: 200, message: `OK, available features are: ${currentFeatures}`, data: currentFeatures };
  } else {
    result = { status: 200, message: 'No features available', data: 0 };
  }
  return result;
};

const getSeats = async (req) => {
  const { email } = req.params;
  const assets = await getAssetsByUser(email);
  const { usedSeats, seats } = assets;
  const remainSeats = seats - usedSeats;
  let result;
  if (remainSeats < 0) {
    result = { status: 200, message: 'No seats available', data: 0 };
  } else {
    result = { status: 200, message: `OK, available seats: ${remainSeats}`, data: remainSeats };
  }
  return result;
};

const getCredit = async (req) => {
  const assetsAccount = await getAssetsByUser(req.params.email);
  const currentCredit = assetsAccount.credits;
  let result;
  if (currentCredit <= 0) {
    result = { status: 200, message: 'No available credit', data: 0 };
  } else {
    result = { status: 200, message: `OK, available credit: ${currentCredit}`, data: currentCredit };
  }
  return result;
};

module.exports = { getFeatures, getSeats, getCredit };
