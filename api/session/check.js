function check(req, res, next) {
    if (req.path != '/login') {
        if (req.cookies.user === undefined || req.cookies.hash === undefined || req.cookies.lpu === undefined) {
            res.redirect('/login');
        } else {
            res.cookie('hash', req.cookies.hash, { maxAge: 32400000 });
            res.cookie('user', req.cookies.user, { maxAge: 32400000 });
            res.cookie('lpu', req.cookies.lpu, { maxAge: 32400000 });
            res.cookie('lpuName', req.cookies.orgName, { maxAge: 32400000 });

            next();
        }
    } else {
        next();
    }
}

module.exports = check;