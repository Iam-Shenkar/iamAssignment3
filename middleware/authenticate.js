const jwt = require('jsonwebtoken');
const {User} = require("../services/authService");

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]
        const Token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
            algorithm: 'HS256'
        });
        if (token === null) res.status(401)

        const user = await User.retrieve(Token.userEmail);
        req.user = user;

        next();
    } catch (err) {
        res.status(403).json({
            message: err.message
        })
    }
}

module.exports = {isAuthenticated}