// const jwt = require('jsonwebtoken');
// const {User} = require("../services/authService");
// const express = require('express')
// const {header} = require("express-validator");
// const authJwt = new express.Router();
//
// // authJwt.post('/refreshToken', async (req, res) => {
// //     const refreshToken = req.body.refreshToken;
// //     if (refreshToken == null) return res.sendStatus(401)
// //     // const user = await User.retrieve({refreshToken: refreshToken})
// //     // if (!user) return res.sendStatus(403)
// //     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
// //         if (err) return res.sendStatus(403)
// //         const accessToken = generateAccessToken({email: user.email})
// //         //  res.setHeader("authorization", "Bearer" + " " + accessToken)
// //         req.token = {accessToken: accessToken};
// //         res.redirect(req.originalUrl);
// //     })
// // })
//
// authJwt.delete('/logout', (req, res) => {
//     const refreshTokens = req.body.token
//     User.delete({refreshTokens: refreshTokens})
//     res.sendStatus(204)
// })
//
// function generateAccessToken(user) {
//     return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
// }
//
//
// module.exports = {authJwt};