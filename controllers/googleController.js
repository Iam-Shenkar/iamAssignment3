const handleGoogleCallBack = (req, res) => {
    // cookies
    res.cookie('jwt', req.authInfo.refToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect('/').json(
        { refreshToken: req.token.refreshToken, accessToken: req.token.accessToken },
    ); // redirect('/')
};

module.exports = { handleGoogleCallBack };
