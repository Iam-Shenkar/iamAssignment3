const jwt = require('jsonwebtoken');


const jwtVerify = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).user;
        if (userObj) {
            next()
        } else {
            res.redirect("/login");
            res.end();
        }

    } catch (error) {
        res.redirect("/login");
        res.end();
    }
}




module.exports = {jwtVerify}