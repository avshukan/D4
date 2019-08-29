const ObjectId = require('mongodb').ObjectId,
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

router.get('/', insertResData, readDoctors, send);


function insertResData(req, res, next) {
    res.resData = {};
    next();
}

function send(req, res, next) {
    res.send(res.resData);
}

function readDoctors(req, res, next) {
    req.db.collection('doctors').find({
        lpucode: req.cookies.lpu
    }).toArray((err, doctors) => {
        if (doctors) {
            res.resData = doctors;
        }
        next();
    });
}

module.exports = router;