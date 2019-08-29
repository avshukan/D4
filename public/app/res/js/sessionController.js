(function(){
    'use strict';
    angular
        .module('RegPortal')
        .controller('SessionController', [
            '$cookies',
             SessionController
        ]);

    function SessionController($cookies)
    {
        const vm = this;
        vm.userName = $cookies.get('user');
        vm.lpuCode = $cookies.get('lpu');
        vm.lpuName = $cookies.get('lpuName');
    }

})();