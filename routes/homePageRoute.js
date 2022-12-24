const express = require("express");
const homePageController = require("../controllers/homePageController");


const homePageRouter = new express.Router();

homePageRouter.post("/", (req, res) => {

    res.status(200).json({message: req.user})
})


module.exports = {homePageRouter};
