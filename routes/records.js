const ObjectId = require('mongodb').ObjectId,
      jsonxml = require('jsontoxml'),
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

router.get('/', insertResData, readRecords, send);

router.get('/nhistory', insertResData, readNhistoryRecords, prepareNhistoryRecords, updateNhistoryRecords, send);

router.get('/check/:checkId', insertResData, readCheckRecords, send);
router.get('/:recordId', insertResData, readRecord, send);
router.get('/clone/:recordId', insertResData, cloneRecord, readRecords, send);
router.get('/xml/:recordId', insertResData, readRecord, createXml, sendXml);

router.post('/', insertResData, createRecord, readCheckRecords, send);
router.put('/:recordId', insertResData, updateRecord, readCheckRecords, send);
router.delete('/:recordId', insertResData, deleteRecord, readCheckRecords, send);


function readNhistoryRecords(req, res, next) {
    req.db.collection('records').find({
        'zl_list.zap.z_sl.nhistory': /./
    }).toArray((err, records) => {
        if (records) {
            res.resData = records;
        }
        next();
    });
}

function prepareNhistoryRecords(req, res, next) {
    if (res.resData) {
        if (res.resData.length > 0) {
            res.resData = res.resData.map((record) => {
                const _nhistory = record.zl_list.zap.z_sl.nhistory;
                record.zl_list.zap.z_sl.sl = record.zl_list.zap.z_sl.sl.map((sl, _index) => {
                        sl.nhistory = `${_nhistory}-${_index}`;
                        return sl;
                });
                delete(record.zl_list.zap.z_sl.nhistory);
                return record;
            })
        }
    }
    next();
}

function updateNhistoryRecords(req, res, next) {
    if (res.resData) {
        if (res.resData.length > 0) {
            res.resData.forEach((record) => {
                const _id = record._id
                delete(record._id);

                req.db.collection('records').updateOne(
                    {
                        _id: new ObjectId(_id)
                    }, 
                    {
                        $set: record
                    }, 
                    (err, doc) => {
                        //next();
                    }
                );


            });
        }
    }
}



function insertResData(req, res, next) {
    res.resData = {};
    next();
}

function send(req, res, next) {
    res.send(res.resData);
}

function sendXml(req, res, next) {
    res.send(res.resData.xml);
}

function createXml(req, res, next) {
    const xml = jsonxml(JSON.stringify(res.resData));
    res.resData.xml = xml;
    next();
}

function readCheckRecords(req, res, next) {
    req.db.collection('records').find({
        'zl_list.schet._id': req.params.checkId,
        'zl_list.schet.code_mo': req.cookies.lpu
    }).toArray((err, records) => {
        if (records) {
            res.resData = records.reverse();
        }
        next();
    });
}

function readRecords(req, res, next) {
    req.db.collection('records').find({

    }).toArray((err, records) => {
        if (records) {
            res.resData = records;
        }
        next();
    });
}

function readRecord(req, res, next) {
    req.db.collection('records').find({
        _id: new ObjectId(req.params.recordId)
    }).toArray((err, record) => {
        if (record) {
            res.resData = record;
        }
        next();
    });
}

function createRecord(req, res, next) {
    req.db.collection('records').insertOne(req.body, (err, result) => {
        next();
    });
}

function deleteRecord(req, res, next) {
    req.db.collection('records').deleteOne({
        _id: new ObjectId(req.params.recordId)
    }).then(
        (result) => {
            next();
        },
        (error) => {
            next();
        }
    );
}

function updateRecord(req, res, next) {
    delete(req.body._id);

    req.db.collection('records').updateOne(
        {
            _id: new ObjectId(req.params.recordId)
        }, 
        {
            $set: req.body
        }, 
        (err, doc) => {
            next();
        }
    );
}

function cloneRecord(req, res, next) {
    req.db.collection('records').find({
        _id: new ObjectId(req.params.recordId)
    }).toArray((err, record) => {
        if (record) {
            const clone = record.pop();
            delete(clone._id);

            req.db.collection('records').insertOne(clone, (err, result) => {
                next();
            });
        } else {
            next();
        }
        
    });
}

module.exports = router;