(function(){
    'use strict';
    angular
        .module('RegPortal')
        .filter('filterRecords', filterRecords);

    function filterRecords()
    {

        return function(list, field, value)
        {
            if (field == '' || value == '' ) {
                return list;
            }

            return list.filter(function(listElement){
                
                // if (field == 'date_z_1') {
                //     return listElement.zl_list.zap.z_sl.date_z_1 == value;
                // }

                if (field == 'fam') {
                    return listElement._pacient.fam == value;
                }

                if (field == 'idbars') {
                    return listElement.zl_list.zap.pacient.id_pac == value;
                }

                if (field == 'snils') {
                    return listElement._pacient.snils == value;
                }

                if (field == 'ds') {
                    return listElement.zl_list.zap.z_sl.sl[0].ds1 == value;
                }


                if (field == 'lastname') {
                    return listElement._doctor.lastname == value;
                }

                return listElement;
            });
        }
    }
})();