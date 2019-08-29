(function(){
    'use strict';
    angular
        .module('RegPortal')
        .factory('CheckRecords', [
            CheckRecords
        ]);

    function CheckRecords(){
        function ObjectId() {}
        var fields = [{
                path: 'zl_list.schet.summav',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.schet.summap',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.schet.sank_mek',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.schet.sank_mee',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.schet.sank_ekmp',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sumv',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sump',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sank_it',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ed_col',
                pattern: /^\d{1,5}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.tarif',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.sum_m',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.onk_sl.sod',
                pattern: /^\d{1,4}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.onk_sl.wei',
                pattern: /^\d{1,3}\.\d{1}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.onk_sl.bsa',
                pattern: /^\d{1}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ksg_kpg.koef_z',
                pattern: /^\d{1}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ksg_kpg.koef_up',
                pattern: /^\d{1}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ksg_kpg.bztsz',
                pattern: /^\d{1,6}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ksg_kpg.koef_d',
                pattern: /^\d{1,2}\.\d{2,5}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ksg_kpg.koef_u',
                pattern: /^\d{1,2}\.\d{2,5}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ksg_kpg.it_sl',
                pattern: /^\d{1}\.\d{2,5}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.ksg_kpg.sl_koef.z_sl',
                pattern: /^\d{1}\.\d{2,5}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.usl.kol_usl',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.usl.tarif',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }, {
                path: 'zl_list.zap.z_sl.sl.usl.sumv_usl',
                pattern: /^\d{1,15}\.\d{2}$/gi
            }];

            function isNotNull(prop) {
                return (prop === null) ? false : true;
            }

            function isNotUndefined(prop) {
                return (prop === undefined) ? false : true;
            }

            function isArray(prop) {
                return Array.isArray(prop);
            }

            function isObject(prop) {
                if (!isArray(prop)) {
                    return prop instanceof Object;
                }
                return false;
            }

            function isString(prop) {
                return Object.is(typeof prop, 'string');
            }

            function isPatternValid(prop, pattern) {
               return !!(prop.match(pattern));
            }

            var count = 0;
            var errors = '';

            function getField(pathObject, pathArray, pathIndex, pattern) {
                const prop = pathObject[pathArray[pathIndex]];
                if (isNotNull(prop) && isNotUndefined(prop)) {
                    if (isArray(prop)) {
                        prop.forEach((_prop) => {
                            getField(_prop, pathArray, pathIndex + 1, pattern);
                        });
                    }
                    if (isObject(prop)) {
                        getField(prop, pathArray, pathIndex + 1, pattern);
                    }
                    if (isString(prop)) {
                        
                        // ---------------------------------------------
                        if (prop.length > 0) {
                            if (!isPatternValid(prop, pattern)) {

                                errors += `<tr>
                                               <td>${pathArray.join('.')}</td>
                                               <td>${prop}</td>
                                               <td>Ошибка</td>
                                               <td>Не соответствует шаблону</td>
                                           </tr>\r\n`;
                            }
                        }
                        // ---------------------------------------------
                        
                    }
                    return;
                } else {
                    return;
                }

                count++;
                if (count > 30) { 
                     console.log('Error');
                    return;
                }
            }

            






        return {
            check: (records) => {
               

                records.forEach((record) => {
                    errors += `<tr>
                                   <td><strong>${record._pacient.fam} ${record._pacient.im} ${record._pacient.ot} (${record._pacient.snils})</strong></td>
                                   <td><strong>Значение</strong></td>
                                   <td><strong>Статус</strong></td>
                                   <td><strong>Причина</strong></td>
                               </tr>\r\n`;
                    fields.forEach((field) => {
                        getField( record, field.path.split('.'), 0, field.pattern );
                    });
                })

                var newWin = window.open("about:blank", "Проверка счета", "width=600,height=400");

                newWin.document.write(
                  `<table>${errors}</table>
                  <style>
                    table {
                        border-spacing: 0;
                    }

                    td {
                        padding: 5px;
                        border: 1px solid #bcbcbc;
                    }

                  </style>`
                );
            }
        };

    }
})(); 