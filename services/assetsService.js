const authService = require('./authService');
const accountService = require('./accountService');
const { Account, User } = require('../repositories/repositories.init');
const { httpError } = require('../class/httpError');

const getAccountByUser = async (email) => {
  const user = await authService.userExist(email);
  if (!user) {
    throw new httpError(404, "user doesn't exist");
  }
  const { accountId } = user;
  const account = await Account.retrieve({ _id: accountId });
  if (!account) throw new httpError(400, "couldn't find account");
  return account;
};

const getAssetsByUser = async (email) => {
  const account = await getAccountByUser(email);
  return account.assets;
};

const getFeatures = async (mail) => {
  console.log(`1: ${mail}` );
  const email = mail;
  const assets = await getAssetsByUser(email);
  const currentFeatures = assets.features;
  let result;

  if (currentFeatures) {
    result = { status: 200, message: `OK, available features are: ${currentFeatures}`, data: {features: currentFeatures} };
  } else {
    result = { status: 400, message: 'No features available', data: {features: 0} };
  }
  return result;
};

const getSeats = async (mail) => {
  const email = mail;
  const assets = await getAssetsByUser(email);
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

const getCredit = async (mail) => {
  const assetsAccount = await getAssetsByUser(mail);
  const currentCredit = assetsAccount.credits;
  let result;
  if (currentCredit <= 0) {
    result = { status: 400, message: 'No available credit', data: { credit: -1 } };
  } else {
    result = { status: 200, message: `OK, available credit: ${currentCredit}`, data: { credit: currentCredit } };
  }
  return result;
};

const setSeats = async (mail, count = 1) => {
  const assets = await getAssetsByUser(mail);
  const accountID = await getAccountByUser(mail);
  const { usedSeats, seats } = assets;
  let result;
  if (getSeats(mail).data.seats >= count) {
    console.log(`2: ${result}` );
    const newSeats = usedSeats + count;
    await accountService.Account.update({ _id: accountID._id }, { 'assets.usedSeats': newSeats });
    result = { status: 200, message: `OK, used seats has been updated: ${newSeats}`, data: { seats: seats-newSeats } };
    console.log(`22: ${result}` );
  } else {
    result = { status: 400, message: 'ERROR, no available seats',data: { seats: -1} };
  }
  return result;
};

const setCredit = async (mail, count = 1) => {
  const assets = await getAssetsByUser(mail);
  const accountID = await getAccountByUser(mail);
  const { credits } = assets;
  let result;
  if (getCredit(mail).data.credit >= count) {
    const newCredit = credits - count;
    await accountService.Account.update({ _id: accountID._id }, { 'assets.credits': newCredit });
    result = { status: 200, message: `OK, used seats has been updated: ${newCredit}`, data: { credit: newCredit } };
    console.log(`444: ${result}` );
  } else {
    result = { status: 400, message: 'ERROR, no available credit', data: { credit: -1 } };
  }
  return result;
};

const setFeature = async (mail, feature) => {
  const assets = await getAssetsByUser(mail);
  const accountID = await getAccountByUser(mail);
  const currentFeatures = assets.features;
  const isFeatureExists = currentFeatures.includes(feature);
  let result;
  if (isFeatureExists) {
    result = { status: 400, message: `ERROR, feature ${feature} already exists`, data: { feature: -1 } };
  } else {
    await accountService.Account.update({ _id: accountID._id }, { $push: { 'assets.features': feature } });
    result = { status: 200, message: `OK, feature ${feature} has been added`, data: { 'feature': feature } };
  }
  return result;
};

module.exports = {
  getFeatures, getSeats, getCredit, setCredit, setSeats, setFeature,
};
