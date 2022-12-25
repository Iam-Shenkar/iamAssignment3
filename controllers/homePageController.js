const Organization = require("../repositories/organization.repositories");
const organization = new Organization();


const fuck = (req, res, next) => {
    console.log(req.body)

    return res.status(400)
}
const shit = (req, res, next) => {
    console.log(req.body)

    return res.status(400)
}

module.exports = {fuck, shit}


