const express = require("express");
const homePageController = require("../controllers/homePageController");
const homePageRouter = new express.Router();

homePageRouter.post("/",jwtVerify,homePageController.homePageControl);



module.exports = {homePageRouter};
