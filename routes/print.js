const ObjectId = require('mongodb').ObjectId,
      express = require('express'),
      router = express.Router(),
      md5 = require('md5');

router.get('/:checkId', insertRenderData, getCheck, getRecords, createExcel, send);

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

function createExcel(req, res, next) {
    res.renderData.excelTable = getExcelTable(
        getHeader(res.renderData.check, {
            name: '', 
            code: (req.cookies) ? req.cookies.lpu : ''
        }),
        getNames(),
        getRows(res.renderData.records),
        getFooter()
    );
    next();
}

function getExcelTable(header, names, rows, footer) {
    return `
        <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
        <meta charset="utf-8">
        <xml>
        <x:ExcelWorkbook>
        <x:ExcelWorksheets>
        <x:ExcelWorksheet>
        <x:Name>&#1056;&#1077;&#1079;&#1091;&#1083;&#1100;&#1090;&#1072;&#1090;&#1099;</x:Name>
        <x:WorksheetOptions>
        <x:DoNotDisplayGridlines>False</x:DoNotDisplayGridlines>
        </x:WorksheetOptions>
        </x:ExcelWorksheet>
        </x:ExcelWorksheets>
        </x:ExcelWorkbook>
        </xml>
        </head>
        <body>
        <table style="border-spacing: 0; border: 1px solid black; border-bottom: none; border-right: none;">
            <tbody>
                ${header}
                ${names}
                ${rows}
                ${footer}
            </tbody>
        </table>
        <style>
            table, td {border:0.1mm solid black}
            table {border-collapse:collapse}
        </style>
        </body>
        </html>
    `;
}

function getHeader(check, lpu) {
    const date = `${new Date().getDate()}`.padStart(2, '0'),
          month = `${new Date().getMonth() + 1}`.padStart(2, '0'),
          year = `${new Date().getFullYear()}`;

    return `
        <tr>
            <td style="text-align: center" colspan="16">
                Р Е Е С Т Р&nbsp;&nbsp;&nbsp;&nbsp;N<br style="mso-data-placement:same-cell">
                к счету № ${check.nschet} от ${date}.${month}.${year} на оплату медицинской помощи, оказанной по программе ОМС<br style="mso-data-placement:same-cell">                                                 
                МО: ${lpu.name} (${lpu.code})<br style="mso-data-placement:same-cell">
                за период ${check.year}.${check.month}<br style="mso-data-placement:same-cell">
            </td>
        </tr>
    `;
}

function getNames() {
    return `
        <tr style="vertical-align: text-top;">
            <td height="254" width="56">№ п/п</td>
            <td height="254" width="173">Фамилия, имя, отчество</td>
            <td height="254" width="34">Пол</td>
            <td height="254" width="76">Дата рождения</td>
            <td height="254" width="200">Адрес постоянного места жительства</td>
            <td height="254" width="215">Вид, серия, номер документа, удостоверяющего личность, СНИЛС</td>
            <td height="254" width="243">Наименование СМО (с указанием кода терр.), серия, номер страхового медицинского полиса ОМС</td>
            <td height="254" width="57">Условия оказания МП, Вид МП, Способ оплаты МП</td>
            <td height="254" width="83">Дата посещения, начала лечения, диспансеризации</td>
            <td height="254" width="78">Дата окончания лечения, диспансеризации. Количество койко-дней </td>
            <td height="254" width="60">Код профиля оказанной МП</td>
            <td height="254" width="83">Код специальности врача/ср.мед раб., Код профиля отделения</td>
            <td height="254" width="64">Код заболевания по МКБ-10, Код результата обращения, Код исхода заболевания</td>
            <td height="254" width="102">Код клинико-статистической группы</td>
            <td height="254" width="102">Сумма к оплате(руб.)</td>
            <td height="254" width="116">Признак особый случай Код повыш.(понижающего) коэф. * Код мед. услуги(хир. Операции)</td>
        </tr>
        <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>13</td>
            <td>14</td>
            <td>15</td>
            <td>16</td>
        </tr>
    `;
}

function getRows(records) {
    const rows = [];
    records.forEach((record, index) => {
        rows.push( `
            <tr>
                <td>${index + 1}</td>
                <td>${record._pacient.fam} ${record._pacient.im} ${record._pacient.ot}</td>
                <td>${(record._pacient.w == '1') ? 'М' : 'Ж'}</td>
                <td>${record._pacient.dr}</td>
                <td>Нет</td>
                <td>Паспорт гражданина РФ, ${record._pacient.docser} ${record._pacient.docnum}, ${record._pacient.snils}</td>
                <td>65000-САХАЛИНСКИЙ ФИЛИАЛ АО СК СОГАЗ-МЕД, ${record.zl_list.zap.pacient.npolis}</td>
                <td>
                    ${record.zl_list.zap.z_sl.usl_ok}<br style="mso-data-placement:same-cell">
                    ${record.zl_list.zap.z_sl.vidpom[0]}.${(record.zl_list.zap.z_sl.vidpom[1]) ? record.zl_list.zap.z_sl.vidpom[1]:'0'}<br style="mso-data-placement:same-cell">
                    ${record.zl_list.zap.z_sl.idsp}
                </td>
                <td>${record.zl_list.zap.z_sl.date_z_1}</td>
                <td>
                    ${record.zl_list.zap.z_sl.date_z_2}<br style="mso-data-placement:same-cell">
                    ${(record.zl_list.zap.z_sl.kd_z) ? record.zl_list.zap.z_sl.kd_z : 0}
                </td>
                <td>${record.zl_list.zap.z_sl.sl[0].profil}</td>
                <td>
                    ${(record.zl_list.zap.z_sl.sl[0].prvs) ? record.zl_list.zap.z_sl.sl[0].prvs : 'Нет'}<br style="mso-data-placement:same-cell">
                    ${(record.zl_list.zap.z_sl.sl[0].podr) ? record.zl_list.zap.z_sl.sl[0].podr : 'Нет'}
                </td>
                <td>
                    ${record.zl_list.zap.z_sl.sl[0].ds1}<br style="mso-data-placement:same-cell">
                    ${record.zl_list.zap.z_sl.rslt}<br style="mso-data-placement:same-cell">
                    ${record.zl_list.zap.z_sl.ishod}
                </td>
                <td>${(record.zl_list.zap.z_sl.sl[0].ksg_kpg) ? record.zl_list.zap.z_sl.sl[0].ksg_kpg.n_ksg : 'Нет'}</td>
                <td>${record.zl_list.zap.z_sl.sumv.replace('.', ',')}</td>
                <td>
                    ${(record.zl_list.zap.z_sl.os_sluch) ? record.zl_list.zap.z_sl.os_sluch : 'Нет'}<br style="mso-data-placement:same-cell">
                    ${(record.zl_list.zap.z_sl.sl[0].usl[0]) ? record.zl_list.zap.z_sl.sl[0].usl[0].code_usl : 'Нет'}
                </td>
            </tr>
        `);
    });
    return rows.join('');
}

function getFooter() {
    return `
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: left;" colspan="16">
                <br style="mso-data-placement:same-cell">
                Сумма прописью<br style="mso-data-placement:same-cell">
                Руководитель медицинской организации ________________ /ФИО/<br style="mso-data-placement:same-cell">
                Главный бухгалтер ________________ /ФИО/<br style="mso-data-placement:same-cell">
            </td>
        </tr>
    `;
}




module.exports = router;