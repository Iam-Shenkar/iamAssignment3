const jwt = require('jsonwebtoken');
const {User} = require("../services/authService");
const express = require('express')
const {header} = require("express-validator");
const authJwt = new express.Router();

authJwt.post('/token', async (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    const user = await User.retrieve({refreshToken: refreshToken})
    console.log(refreshToken)
    if (!user) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({email: user.email})
        res.set({"authorization": "Bearer" + " " + accessToken})
        res.json({accessToken: accessToken})
    })
})

authJwt.delete('/logout', (req, res) => {
    const refreshTokens = req.body.token
    User.delete({refreshTokens: refreshTokens})
    res.sendStatus(204)
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}


module.exports = {authJwt};