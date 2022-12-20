const loginService = require('../services/loginService');
const googleService = require('../services/googleService');


const googleControl = (req,res,next) => {
    googleService.handleGoogleCookies(req,res,next)
}

const loginControl = async (req, res, next) => {
    try{
        await loginService.handleLogin(req,res,next);
        await loginService.handleCookies(req, res, next);
        return res(200).json({'status':200, 'message': 'validation succeeded! welcome' })

    } catch (err){
        console.log(err)
        return res.status(401).json({message: err.message})
    }

}

const forgotPassControl = async (req, res, next) => {

}



module.exports = {loginControl, googleControl, forgotPassControl};