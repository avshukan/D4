(function(){
    'use strict';
    angular
        .module('RegPortal')
        .filter('filterListField', filterListField);

    function filterListField()
    {

        return function(list, field, value)
        {
            if (list != undefined) {
                if (field == '' || value == '' ) {
                    return list;
                }

                return list.filter(function(listElement){
                    
                    if (listElement[field]) {
                        return listElement[field].toString().match( new RegExp(value, 'gi') );
                    }
                    return listElement;
                });
            }
            
        }
    }
})();