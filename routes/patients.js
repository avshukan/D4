const ObjectId = require('mongodb').ObjectId,
      mongodbDBF = require('../api/db/mongodbDBF'),
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

router.get('/', insertResData, send);
router.get('/:patientId', insertResData, readPatient, send);

function insertResData(req, res, next) {
    res.resData = [];
    next();
}

function send(req, res, next) {
    res.send(res.resData);
}

function readPatient(req, res, next) {
    const searchValue = req.params.patientId.replace(/[- ]*/gi, '');
    const searchProp = (searchValue.length == 11) ? 'snils' : 'idbars'; 
    req.dbf.collection('Dbf2Base_patientinfo').find({
        [searchProp]: searchValue
    }).toArray((err, patient) => {
        if (patient) {
            res.resData = patient;
        }
        next();
    });
}

module.exports = router;
