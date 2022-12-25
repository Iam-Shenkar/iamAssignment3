const express = require("express");
const homePageController = require("../controllers/homePageController");
const {User} = require("../services/authService");

const homePageRouter = new express.Router();

homePageRouter.post("/", (req, res) => {

    res.status(200).json({refreshToken: req.token.refreshToken, accessToken: req.token.accessToken})
})

module.exports = {homePageRouter};
