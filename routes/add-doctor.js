const ObjectId = require('mongodb').ObjectId,
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

router.post('/', insertDoctor, render);

function render(req, res, next) {
    res.render('d4');
}

async function insertDoctor(req, res, next) {
    const { 
            lpucode,
            lastname,
            firstname,
            middlename,
            snils
           } = req.body;

    await req.db.collection('doctors').insertOne({
        lpucode,
        lastname,
        firstname,
        middlename,
        snils: cleanSnils(snils),
    });
    next();
}

function cleanSnils(snils) {
  return snils.replace(/-/gi, '')
              .replace(/ /gi, '')
              .replace(/\D/gi, '')
              .slice(0, 11);

}

module.exports = router;
