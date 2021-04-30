const ObjectId = require('mongodb').ObjectId,
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

router.get('/', insertSessionData, checkActiveSession, render);
router.post('/', insertSessionData, checkUser, createHash, saveHash, setActiveSession, redirectActiveSession, render);

function render(req, res, next) {
    res.render('login', res.sessionData);
}

function redirectActiveSession(req, res, next) {
    if (res.sessionData.user && res.sessionData.hash) {
        res.redirect('/');
    }
    else {
        next();
    }
}

function checkActiveSession(req, res, next) {
    res.sessionData.activeSession = !!(req.cookies.user || req.cookies.hash);
    if (res.sessionData.activeSession) {
        res.sessionData.user = {
            name: req.cookies.user
        };
    }
    next();
}

function insertSessionData(req, res, next) {
    if (res.sessionData === undefined) {
        res.sessionData = {
            layout: false
        };
    }
    next();
}

function checkUser(req, res, next) {
    req.db.collection('users').find({
        login: req.body.login,
        password: req.body.password
    }).toArray((err, user) => {
        if (user.length == 1) {
            res.sessionData.user = user.pop();
        }
        else {
            res.sessionData.loginError = true;
        }
        next();
    });
}

function createHash(req, res, next) {
    if (res.sessionData.user) {
        res.sessionData.hash = Math.random() + Math.random() * Math.random();
    }
    next();
}

function setActiveSession(req, res, next) {
    if (res.sessionData.user && res.sessionData.hash) {
        res.cookie('hash', md5(res.sessionData.hash), { maxAge: 32400000 });
        res.cookie('user', res.sessionData.user.name, { maxAge: 32400000 });
        res.cookie('lpu', res.sessionData.user.orgCode, { maxAge: 32400000 });
        res.cookie('lpuName', res.sessionData.user.orgName, { maxAge: 32400000 });
    }
    next();
}

function saveHash(req, res, next) {
    if (res.sessionData.user && res.sessionData.hash) {
        req.db.collection('users').updateOne({ 
                _id: new ObjectId(res.sessionData.user._id) 
            }, 
            { $set: { 
                "session.hash": res.sessionData.hash 
                }
            } 
        );
    }
    next();
}


module.exports = router;