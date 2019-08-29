const ObjectId = require('mongodb').ObjectId,
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

router.get('/', insertResData, readChecks, send);
router.get('/:checkId', insertResData, readCheck, send);
router.get('/calc/:checkId', insertResData, getRecordsSumm, calcCheckSumm, readChecks, send);
router.post('/', insertResData, createCheck, readChecks, send);
router.put('/:checkId', insertResData, updateCheck, readChecks, send);
router.delete('/:checkId', insertResData, deleteCheck, readChecks, send);

function insertResData(req, res, next) {
    res.resData = {};
    next();
}

function send(req, res, next) {
    res.send(res.resData);
}

function getRecordsCount(req, res, next) {
    res.resData = res.resData.map((check) => {
        return req.db.collection('records').find({
            'zl_list.schet._id': check._id
        }).count().then((count) => {
            console.log('---(',count);
            check.records = count;
            return check;
        });
    });
    Promise.all(res.resData).then((result) => {
        console.log('----> ', result);
        next();
    });
}

function calcCheckSumm(req, res, next) {
    
    if (res.resData.recordsSumm) {
        const totalSumm = res.resData.recordsSumm.reduce((acc, summ) => {
            return acc += parseFloat(summ);
        }, 0.0);



        req.db.collection('checks').updateOne(
            {
                _id: new ObjectId(req.params.checkId)
            }, 
            {
                $set: {summav: totalSumm.toFixed(2)}
            }, 
            (err, doc) => {
                console.log(err, doc);
                next();
            }
        );
    }
    
}

function getRecordsSumm(req, res, next) {
    req.db.collection('records').find({
        'zl_list.schet._id': req.params.checkId
    }).toArray((err, records) => {
        if (records) {
            res.resData.recordsSumm = [];
            records.forEach((record, index) => {
                console.log('=====================>>>  ${index}', record._id,  record.zl_list.zap.z_sl.sumv);
                res.resData.recordsSumm.push(record.zl_list.zap.z_sl.sumv);
            });
        }
        console.log('------------------------->>', res.resData.recordsSumm);
        next();
    });

}

function readChecks(req, res, next) {
    req.db.collection('checks').find({
        code_mo: req.cookies.lpu
    }).toArray((err, checks) => {
        if (checks) {
            res.resData = checks;
        }
        next();
    });
}

function readCheck(req, res, next) {
    req.db.collection('checks').find({
        _id: new ObjectId(req.params.checkId)
    }).toArray((err, check) => {
        if (check) {
            res.resData = check;
        }
        next();
    });
}

function createCheck(req, res, next) {
    req.db.collection('checks').insertOne(req.body, (err, result) => {
        next();
    });
}

function deleteCheck(req, res, next) {
    req.db.collection('checks').deleteOne({
        _id: new ObjectId(req.params.checkId)
    }).then(
        (result) => {
            next();
        },
        (error) => {
            next();
        }
    );
}

function updateCheck(req, res, next) {
    delete(req.body._id);
    req.db.collection('checks').updateOne(
        {
            _id: new ObjectId(req.params.checkId)
        }, 
        {
            $set: req.body
        }, 
        (err, doc) => {
            console.log(err, doc);
            next();
        }
    );
}

module.exports = router;