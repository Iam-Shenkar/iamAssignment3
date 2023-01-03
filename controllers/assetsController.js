const assetsService = require('../services/assetsService');
const authService = require('../services/authService');
const accountService = require('../services/accountService');
const { httpError } = require('../classes/httpError');

const getAllAssets = async (req, res, next) => {
    try {
        const user = authService.userExist(req.user.email);
        if (!user) throw new httpError(404, 'user not exists');

        const account = user.accountId;
        const assets = await accountService.Account.retrieve({_id: account});
        res.send(assets);
    } catch (err) {
        next(err);
    }
};

const isFeatureAllowed = async (req, res, next) => {
    try {
        const result = await assetsService.getFeatures(req);
        res.status(result.status).json(result.message || result.data);
    } catch (err) {
        next(err);
    }
};

const getSeats = async (req, res, next) => {
    try {
        const result = await assetsService.getSeats(req);
        res.status(result.status).json(result.message || result.data);
    } catch (err) {
        next(err);
    }
};

const getCredit = async (req, res, next) => {
    try {
        const result = await assetsService.getCredit(req);
        res.status(result.status).json(result.message || result.data);
    } catch(err) {
        next(err);
    }
};

module.exports = {
    isFeatureAllowed,
    getSeats,
    getCredit,
    getAllAssets,
};
