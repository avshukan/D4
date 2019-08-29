var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies) {
        res.cookie('hash', null, { maxAge: -32400000 });
        res.cookie('user', null, { maxAge: -32400000 });
        res.cookie('lpu', null, { maxAge: -32400000 });
        res.cookie('lpuName', null, { maxAge: -32400000 });
    }
    res.redirect('/');
});

module.exports = router;