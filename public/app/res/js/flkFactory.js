(function(){
    'use strict';
    angular
        .module('RegPortal')
        .factory('FlkFactory', [
            '$http', 
            'API_URL',
            FlkFactory
        ]);

    function FlkFactory($http, API_URL){
        const tests = [
            isEmptySoname
        ];

        function isEmptySoname(record) {
            const error = { 
                status: false, 
                code: 'ZL_LIST/ZAP/Z_SL/OS_SLUCH', 
                text: `Признак "Особый случай" при регистрации обращения за медицинской помощью. 
                       Необходимое значение: 2 – в документе, удостоверяющем личность пациента /родителя (представителя) пациента, отсутствует отчество
                      `
            };
            
            if (record._pacient.ot === null || `${record._pacient.ot}`.trim().length === 0) { 
                if (record.zl_list.zap.z_sl.os_sluch !== "2") {
                    error.status = true;
                }
            }
            return error;
        }

        function run(record) {
            const errors = [];
            tests.forEach( test => errors.push( test(record) ) )
            return errors;
        }

        return {
            run: run
        };
    }
})(); 
