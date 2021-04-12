const ObjectId = require('mongodb').ObjectId,
      ExcelJS = require('exceljs'),
      express = require('express'),
      router = express.Router(),
      path = require('path'),
      md5 = require('md5');

router.get('/:checkId', insertRenderData, getCheck, getRecords, createExcel);

function insertRenderData(req, res, next) {
    res.renderData = {};
    next();
}

function send(req, res, next) {
    res.setHeader('Content-disposition', 'attachment; filename=file.xls');
    res.setHeader('Content-type', 'application/excel');
    res.send(res.renderData.excelTable);
}

function getRecords(req, res, next) {
    req.db.collection('records').find({
        'zl_list.schet._id': req.params.checkId
    }).toArray((err, records) => {
        res.renderData.records = records;
        next();
    });
}

function getCheck(req, res, next) {
    req.db.collection('checks').find({
        _id: new ObjectId(req.params.checkId)
    }).toArray((err, check) => {
        if (check) {
            res.renderData.check = check.pop();
        }
        next();
    });
}

async function createExcel(req, res, next) {
  const workbook = new ExcelJS.Workbook();
  
  await workbook.xlsx.readFile(path.join(__dirname, 'excel', 'ood-stat.xlsx'));
  const worksheet = workbook.getWorksheet(1);
  res.renderData.records.forEach( (rec) => {
    worksheet.addRow([
      `${rec._pacient.fam} ${rec._pacient.im} ${rec._pacient.ot}`,
      rec._pacient.dr,
      rec._pacient.snils,
      rec.zl_list.zap.pacient.npolis,
      rec.zl_list.zap.z_sl.sl[0].ds1,
      rec.zl_list.zap.z_sl.sl[0].ksg_kpg.n_ksg,
      rec.zl_list.zap.z_sl.sl[0].ksg_kpg.crit[0]?.crit,
      rec.zl_list.zap.pacient.smo,
    ]) 
  })
    
  const buffer = await workbook.xlsx.writeBuffer();
  res.attachment('ood-stat.xlsx');
  res.send(buffer);
    // next();
}

function send(req, res, next) {
  res.send({});
}

module.exports = router;
