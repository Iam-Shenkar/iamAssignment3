const homePageService = require('../services/homePageService');
const path = require("path");


const homePageHandle = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "homePage.html"));
}



module.exports= {homePageHandle}


