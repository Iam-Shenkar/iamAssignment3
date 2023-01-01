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

const checkFeatures = async (req) => {
  const { email, feature } = req.params;
  const assets = await getAssetsByUser(email);
  const currentFeatures = assets.features;
  const isFeatureExists = currentFeatures.includes(feature);
  let result;
  if (isFeatureExists) {
    result = { status: 200, message: `OK, feature ${feature} exists and available`, data: feature };
  } else {
    result = { status: 200, message: `No feature ${feature} doesn't exist`, data: 0 };
  }
  return result;
};

const seatsCheck = async (req) => {
  const { email } = req.params;
  const accountID = await getAccountByUser(email);
  const assets = await getAssetsByUser(email);
  const { usedSeats } = assets;
  const { availableSeats } = assets;
  const remainSeats = usedSeats - availableSeats;
  let result;
  if (remainSeats >= 0) {
    result = { status: 200, message: 'No seats remain', data: 0 };
  } else {
    result = { status: 200, message: `OK, remain seats: ${remainSeats}`, data: remainSeats };
    await accountService.Account.update({ _id: accountID }, { 'assets.seats': remainSeats });
  }
  return result;
};

const creditCheck = async (req) => {
  const wantedCredit = req.params.credit;
  const assetsAccount = await getAssetsByUser(req.params.email);
  const accountID = getAccountByUser(req.params.email);
  const currentCredit = assetsAccount.credits;
  const remainCredit = currentCredit - wantedCredit;
  let result;
  if (remainCredit < 0) {
    result = { status: 200, message: 'No remain credit', data: 0 };
  } else {
    result = { status: 200, message: `OK, remain seats: ${remainCredit}`, data: remainCredit };
    accountService.Account.update({ _id: accountID }, { 'assets.credits': remainCredit });
  }
  return result;
};

module.exports = { checkFeatures, seatsCheck, creditCheck };
