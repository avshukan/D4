(function(){
    'use strict';
    angular
        .module('RegPortal')
        .factory('CheckModelFactory', [
            CheckModelFactory
        ]);

    function CheckModelFactory(){
        return {
            new: (lpuCode, type) => {
              return {
                "code": '' + Math.random().toString().slice(2, 10),
                "code_mo": "0",
                "year": "0",
                "month": "0",
                "nschet": "0",
                "dschet": "",
                "plat": "65001",
                "summav": "0.00",
                "coments": null,
                "summap": null,
                "sank_mek": null,
                "sank_mee": null,
                "sank_ekmp": null,
                "code_mo": lpuCode,
                "coments": type
              }
            }
        };
    }
})(); 
