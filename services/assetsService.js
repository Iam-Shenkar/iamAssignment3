const authService = require('./authService');
const accountService = require('./accountService');
const { Account, User } = require('../repositories/repositories.init');
const { httpError } = require('../class/httpError');

const getAccountByaccountId = async (accountId) => {
  if (!accountId) {
    throw new httpError(400, "accountId doesn't exist");
  }
  const account = await Account.retrieve({ _id: accountId });
  if (!account) throw new httpError(400, "couldn't find account");
  return account;
};

const getAssetsByAccountId = async (accountId) => {
  const account = await getAccountByaccountId(accountId);
  return account.assets;
};

const getFeatures = async (accountId) => {
  const assets = await getAssetsByAccountId(accountId);
  const currentFeatures = assets.features;
  let result;

  if (currentFeatures) {
    result = { status: 200, message: `OK, available features are: ${currentFeatures}`, data: { features: currentFeatures } };
  } else {
    result = { status: 400, message: 'No features available', data: { features: 0 } };
  }
  return result;
};

const getSeats = async (accountId) => {
  const assets = await getAssetsByAccountId(accountId);
  const { usedSeats, seats } = assets;
  const remainSeats = seats - usedSeats;
  let result;
  if (remainSeats < 0) {
    result = { status: 400, message: 'No seats available', data: { seats: -1 } };
  } else {
    result = { status: 200, message: `OK, available seats: ${remainSeats}`, data: { seats: remainSeats } };
  }
  return result;
};

const getCredit = async (accountId) => {
  const assetsAccount = await getAssetsByAccountId(accountId);
  const currentCredit = assetsAccount.credits;
  let result;
  if (currentCredit <= 0) {
    result = { status: 400, message: 'No available credit', data: { credit: -1 } };
  } else {
    result = { status: 200, message: `OK, available credit: ${currentCredit}`, data: { credit: currentCredit } };
  }
  return result;
};

const setSeats = async (accountId, count = 1) => {
  const assets = await getAssetsByAccountId(accountId);
  const account = await getAccountByaccountId(accountId);
  const { usedSeats, seats } = assets;
  let result;
  const remainSeats = await getSeats(accountId);
  const currentSeat = remainSeats.data.seats;
  if (currentSeat >= count) {
    const newSeats = parseInt(usedSeats) + parseInt(count);
    const remain = seats - newSeats;
    await accountService.Account.update({ _id: account._id }, { 'assets.usedSeats': newSeats });
    result = { status: 200, message: `OK, used seats has been updated: ${newSeats}`, data: { seats: remain } };
  } else {
    result = { status: 400, message: 'ERROR, no available seats', data: { seats: -1 } };
  }
  return result;
};

const setCredit = async (accountId, count = 1) => {
  const assets = await getAssetsByAccountId(accountId);
  const account = await getAccountByaccountId(accountId);
  const { credits } = assets;
  let result;
  const remainCredits = await getCredit(accountId);
  const currentCredit = remainCredits.data.credit;
  if (currentCredit >= count) {
    const newCredit = parseInt(credits - count);
    await accountService.Account.update({ _id: account._id }, { 'assets.credits': newCredit });
    result = { status: 200, message: `OK, used seats has been updated: ${newCredit}`, data: { credit: newCredit } };
  } else {
    result = { status: 400, message: 'ERROR, no available credit', data: { credit: -1 } };
  }
  return result;
};

const setFeature = async (accountId, feature) => {
  const assets = await getAssetsByAccountId(accountId);
  const account = await getAccountByaccountId(accountId);
  const currentFeatures = assets.features;
  const isFeatureExists = currentFeatures.includes(feature);
  let result;
  if (isFeatureExists) {
    result = { status: 400, message: `ERROR, feature ${feature} already exists`, data: { feature: -1 } };
  } else {
    await accountService.Account.update({ _id: account._id }, { $push: { 'assets.features': feature } });

    result = { status: 200, message: `OK, feature ${feature} has been added`, data: { feature } };
  }
  return result;
};

const coreDetails = async (user) => {
  let result;
  if (!user) {
    throw new httpError(404, 'user doesn\'t exist');
  } else {
    const account = await Account.retrieve({ _id: user.accountId });
    if (!account) {
      throw new httpError(404, `account of user ${user.email} doesn't exist`);
    }
    result = {
      status: 200,
      message: 'OK, details were sent',
      data: {
        accountId: account._id, credit: account.assets.credits, plan: account.plan, type: user.type,
      },
    };
  }
  return result;
};

const setSeatsAdmin = async (accountId, count) => {
  const result = await setSeats(accountId, count);
  return result.data;
};

module.exports = {
  getFeatures, getSeats, getCredit, setCredit, setSeats, setFeature, coreDetails, setSeatsAdmin,
};
