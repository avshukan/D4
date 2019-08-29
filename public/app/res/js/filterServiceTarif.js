(function(){
    'use strict';
    angular
        .module('RegPortal')
        .filter('filterServiceTarif', filterServiceTarif);

    function filterServiceTarif()
    {
        return function(services, field, value)
        {
            if (value == '' || value == undefined) {
                return services;
            }

            return services.filter((service) => {
                
                return service.usl[field].includes(value);
            });
        }
    }
})();