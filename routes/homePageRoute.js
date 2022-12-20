const express = require("express");
const homePageController = require("../controllers/homePageController");
const homePageRouter = new express.Router();

homePageRouter.post("/",homePageController.jwtVerify,homePageController.homePageHandle);



module.exports = {homePageRouter};
