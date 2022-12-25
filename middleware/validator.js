const valid = require("./validatorService");
const jwt = require("jsonwebtoken");
const {User} = require("../services/authService");

const generateToken = (req, res, next) => {
    try {
        const accessToken = jwt.sign({
            email: req.body.email
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m'
        });

        const refreshToken = jwt.sign({
            email: req.body.email
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None', secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.set({"authorization": "Bearer" + " " + accessToken})
        req.token = {refreshToken: refreshToken, accessToken: accessToken}
        next()
    } catch (e) {
        return res.sendStatus(401);
    }
}

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userToken) => {
        if (err) {
            await refreshToken(req, res);
            if (res.statusCode !== 200) return res.send();
            next()
        } else {
            req.token = userToken;
            next()
        }
    })
}

const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) return res.status(403).json({message: "Unauthorized"})

    const user = await User.retrieve({refreshToken: refreshToken})
    if (!user) return res.status(403).json({message: "Unauthorized"})
    await jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({message: err.message})
        const accessToken = generateAccessToken({email: user.email})
        res.set("authorization", "Bearer" + " " + accessToken)
        req.token = {accessToken: accessToken};
        return
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const validation = (req, res, next) => {
    try {
        if (req.body.email)
            valid.emailValidator(req.body.email);

        if (req.body.password)
            valid.PasswordValidator(req.body.password);

        if (req.body.name || req.body.name === "")
            valid.nameValidator(req.body.name);

        if (req.body.code)
            valid.codeValidator(req.body.code);

        if (req.body.newPassword)
            valid.PasswordValidator(req.body.newPassword);

        if (req.body.status)
            valid.statusValidator(req.body.status);

        if (req.body.type)
            valid.typeValidator(req.body.type);

        if (req.body.suspensionTime)
            valid.suspensionTimeValidator(req.body.suspensionTime);

        next();

    } catch (err) {
        res.status(412)
            .json({
                success: false,
                message: err.message,
            });
    }
}

module.exports = {validation, generateToken, authenticateToken}