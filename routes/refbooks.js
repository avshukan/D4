const ObjectId = require('mongodb').ObjectId,
      mongodbREF = require('../api/db/mongodbREF'),
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

// router.use(mongodbREF);

router.get('/', insertResData, readRefBook, send);
router.get('/usl', insertResData, readUsls, addTarifPrice, addUslName, send);
router.get('/query', insertResData, readRefBookQuery, filterRefBook, send);
router.get('/search', insertResData, readRefBookSearch, filterRefBook, send);


function insertResData(req, res, next) {
    res.resData = {};
    next();
}

function send(req, res, next) {
    res.send(res.resData);
}

function readRefBook(req, res, next) {
    req.ref.collection(req.query.name).find({ }).toArray((err, refBook) => {
        if (refBook) {
            res.resData = refBook;
        }
        next();
    });
}

function readRefBookQuery(req, res, next) {
    const query = Object.assign({}, req.query);

    delete(query.name);
    delete(query.date_z_2);

    req.ref.collection(req.query.name).find(query).toArray((err, refBook) => {
        if (refBook) {
            res.resData = refBook;
        }
        next();
    });
}

function readRefBookSearch(req, res, next) {
    const prop = Object.keys(Object.assign({}, req.query)).map( (prop) => {
        if (prop != 'name') {
            return prop;
        }
    });

    // const search = {
    //     [prop]: new RegExp(req.query[prop])
    // }

    const search = {};

    prop.forEach((prop) => {
        if (prop != undefined) {
            search[prop] = RegExp(req.query[prop], 'gi')
        }
    });

    req.ref.collection(req.query.name).find(search).toArray((err, refBook) => {
        if (refBook) {
            res.resData = refBook;
        }
        next();
    });
}




function getDate(strDate) {
     if (strDate.length > 0) {
            const arrDate = strDate.split('.').map( (d) => parseInt(d) );
            if (arrDate.length > 0) {
                const date = new Date(arrDate[2], arrDate[1] - 1, arrDate[0]);
                return date;
            }
        }
}

function filterRefBook(req, res, next) {
    if (req.query.date_z_2) {
        // Заглушка!!! Выдаем справочники на 01.01.2019
        req.query.date_z_2 = "01.01.2021";

        const refBooks = [];
        res.resData.forEach((refBook, index) => {
            refBook.DATEEND = (refBook.DATEEND == null || refBook.DATEEND == undefined) ? '' : refBook.DATEEND;
            refBook.DATEBEG = (refBook.DATEBEG == null || refBook.DATEBEG == undefined) ? '' : refBook.DATEBEG;


            if (refBook.DATEBEG.length == 0 && refBook.DATEEND.length == 0) {
                refBooks.push(refBook);
            }

            if (refBook.DATEBEG.length != 0 && refBook.DATEEND.length == 0) {
                if (getDate(req.query.date_z_2) >= getDate(refBook.DATEBEG)) {
                    refBooks.push(refBook);
                }
            } 

            if (refBook.DATEBEG.length == 0 && refBook.DATEEND.length != 0) {
                if (getDate(req.query.date_z_2) <= getDate(refBook.DATEEND)) {
                    refBooks.push(refBook);
                }
            } 

            if (refBook.DATEBEG.length != 0 && refBook.DATEEND.length != 0) {
                if (getDate(req.query.date_z_2) >= getDate(refBook.DATEBEG) && getDate(req.query.date_z_2) <= getDate(refBook.DATEEND)) {
                    refBooks.push(refBook);
                }
            }

            if (res.resData.length - 1 == index) {
                res.resData = refBooks;
                next();
            }
        });
    } else {
        next();
    }
    
}

function readUsls(req, res, next) {
    const lpuCode = `LPU${req.query.lpu}`;
    req.ref.collection('USL_LPU').find({
        [lpuCode]: {$ne: ''}
    }).toArray((err, usls) => {
        if (usls) {
            res.resData = usls.map( (usl) => {
                return {
                    usl: {
                        code: usl.usl,
                        name: ''
                    },
                    usl_ok: usl.usl_ok,
                    dbeg: usl.dbeg,
                    dend: usl.dend,
                    tarif: {
                        code: usl[lpuCode],
                        price: ''
                    }
                }
            });
        }
        next();
    });
}

function addTarifPrice(req, res, next) {
    req.ref.collection('USL_TARIF').find().toArray((err, tarifs) => {
        if (tarifs) {
            res.resData = res.resData.map((usl) => {
                const tarif = tarifs.find((tarif) => {
                    return tarif.num == usl.tarif.code;
                });
                
                if (typeof tarif !== 'undefined') {
                  usl.tarif.price = tarif.tarif;
                }

                return usl;
            });
        }
        next();
    });
}

function addUslName(req, res, next) {
    const uslCodes = res.resData.map( usl => usl.usl.code);
    req.ref.collection('USL_REG').find({
        uslCode: {$in: uslCodes}
    }).toArray((err, uslRegs) => {
        if (uslRegs) {
            res.resData = res.resData.map((usl) => {
                const _usl = uslRegs.filter((uslReg) => {
                    return uslReg.uslCode == usl.usl.code;
                }).pop();

                if(_usl) {usl.usl.name = _usl.uslName}

                return usl;
            });
        }
        next();
    });
}

module.exports = router;
