const authService = require('./authService');
const accountService = require('./accountService');

const getAssetsByUser = async (email) => {
  const user = await authService.userExist(email);
  if (!user) {
    throw new Error("user doesn't exist");
  }
  const account = user.accountId;
  const assets = await accountService.Account.retrieve({ _id: account });
  return assets.assets;
};

const checkFeatures = async (req) => {
  const { email, feature } = req.params;
  const assets = await getAssetsByUser(email);
  const currentFeatures = assets.features;
  console.log(JSON.parse(JSON.stringify(currentFeatures)));
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
  const wantedSeats = req.params.seat;
  const { email } = req.params;
  const assets = await getAssetsByUser(email);
  const currentSeats = assets.seats;
  const remainSeats = currentSeats - wantedSeats;
  let result;
  if (remainSeats < 0) {
    result = { status: 200, message: 'No seats remain', data: 0 };
  } else {
    result = { status: 200, message: `OK, remain seats: ${remainSeats}`, data: remainSeats };
    await accountService.Account.update({ _id: '63ac25971f7170edcb4e6d4e' }, { 'assets.seats': remainSeats });
  }
  return result;
};

const creditCheck = async (req) => {
  const wantedCredit = req.params.credit;
  const assetsAccount = await getAssetsByUser(req.params.email);
  const currentCredit = assetsAccount.credits;
  const remainCredit = currentCredit - wantedCredit;
  let result;
  if (remainCredit < 0) {
    result = { status: 200, message: `OK, remain seats: ${remainCredit}`, data: remainCredit };
    accountService.Account.update({ _id: '63ac25971f7170edcb4e6d4e' }, { 'assets.credits': remainCredit });
  } else {
    result = { status: 200, message: 'No remain credit', data: 0 };
  }
  return result;
};

module.exports = { checkFeatures, seatsCheck, creditCheck };
