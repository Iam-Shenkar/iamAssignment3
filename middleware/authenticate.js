const jwt = require('jsonwebtoken');
const {User, generateToken} = require("../services/authService");

const isAuthenticated = async (req, res, next) => {
        try {
                const token = req.headers.authorization;
                //if (token.token)

                const tokenObj=verifyAccess(token,process.env.ACCESS_TOKEN_SECRET,process.env.JWT_EXPIRE_ACCESS)
                if (tokenObj.expired===true){
                        if (req.body.refreshToken) {
                                const user = await User.retrieve({refreshToken: req.body.refreshToken});
                                const newToken = refreshCheck(req.body.refreshToken, user)
                                if (newToken)
                                        res.header({authorization: token});
                        }
                        else {
                                console.log("need to go to logout")
                        }

                }

                const user = await User.retrieve({'email': tokenObj.Token.userEmail});
                req.user = user;
                res.header({authorization: token});
                next();

        } catch (err) {
/*                res.status(403).json({
                        message: err.message*/
                next();
                }

}

const verifyAccess= (token, secret, expiry)=>{
        try {
                const Token = jwt.verify(token, secret, {
                        expiresIn: expiry,
                        algorithm: 'HS256'
                });
                return {token: Token,expired:false}
        }catch (err){
                return {token: null,expired:true}
        }

}

 const refreshCheck = async (refreshToken,user)=>{
                const refreshVerify = verifyAccess(refreshToken,process.env.REFRESH_TOKEN_SECRET,process.env.JWT_EXPIRE_REFRESH)
                if (refreshVerify.expired===false){
                        const newToken = await generateToken(user.email,process.env.ACCESS_TOKEN_SECRET,process.env.JWT_EXPIRE_ACCESS)
                        return newToken;
                }
        return null;


}

const logout = ()=>{
    console.log("logout")
}

module.exports = {isAuthenticated}