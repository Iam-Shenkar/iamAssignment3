const { User, userExist } = require('../services/authService');
const { Account } = require('../services/accountService');
const { oneTimePass, createAccount, createUser } = require('../services/registerService');
const { userRole } = require('../middleware/validatorService');
const { httpError } = require('../classes/httpError');

async function handleAddUser(req, res, next) {
    try {
        const user = await userExist(req.body.email);
        if (user) throw new httpError(400,'user already exists');

        const accountId = await createAccount(req.body.email);
        if (!accountId) throw new httpError(400,'failed to create new account');
        await createUser(req.body, accountId);

        return res.status(200)
            .json({ message: 'User was added' });
    } catch (err) {
        next(err);
    }
}


async function handleGetUsers(req, res, next) {
    try {
        const users = await User.find({});
        if (users.length < 0 || !users) throw new httpError(400, 'failed to find users list');

        const outputArray = users.reduce((accumulator, currentValue) => [
            ...accumulator,
            {
                Name: currentValue.name,
                email: currentValue.email,
                Role: currentValue.type,
                Status: currentValue.status,
                Edit: '',
            },
        ], []);
        res.status(200).json(outputArray);
    } catch (err) {
        next(err);
    }
}

async function handleGetUser(req, res, next) {
    try {
    const user = await User.retrieve({ email: req.params.email });
    if (!user) throw new httpError(400, 'failed to find user');
    const account = await Account.retrieve({ _id: user.accountId });
    if (!account) throw new httpError(400, 'failed to find account');
    const del = {
        name: user.name,
        email: user.email,
        role: user.type,
        account: account.name,
    };
    res.status(200).json(del);
    } catch (err) {
        next(err);
    }
}

async function handleUpdateUser(req, res , next) {
    try {
        const userType = await User.retrieve({ email: req.body.email });
        if(!userType) throw new httpError(404, 'user not exists');

        if (userType.type === 'admin' && req.body.status !== 'active') {
            await User.update({ email: req.body.email }, { data: req.body, loginDate: new Date() });
        } else if (userType.type === 'admin' && req.body.status === 'active') {
            await User.update({ email: req.body.email }, { data: req.body });
        } else {
            await User.update({ email: req.body.email }, { name: req.body.name });
        }
        return res.status(200).json({ message: 'user update' });
    } catch (err) {
        next(err);
    }
}

async function handleDeleteUser(req, res, next) {
    try {
        const planCheck = await Account.retrieve({ email: req.body.email });
        if(!planCheck) throw new httpError(404,'account not found');
        if (planCheck.plan === 'free') {
            await Account.delete({ email: req.body.email });
        }
        await oneTimePass.delete({ email: req.body.email });
        return res.status(200).json({ message: 'The user has been deleted' });
    } catch (err) {
       next(err);
    }
}

module.exports = {
     handleGetUsers, handleGetUser, handleDeleteUser, handleUpdateUser, handleAddUser
};
