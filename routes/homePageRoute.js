const express = require("express");
const homePageController = require("../controllers/homePageController");


const homePageRouter = new express.Router();

/*homePageRouter.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})*/

homePageRouter.post("/", (req, res) => {
    console.log("homePage")

    return res.sendStatus(200)
})


module.exports = {homePageRouter};
