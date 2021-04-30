(function(){
    'use strict';
    angular
        .module('RegPortal')
        .controller('LoginController', [
            'ApiFactory',
             LoginController
        ]);

    function LoginController(ApiFactory)
    {
        const vm = this;

        vm.checkUserLogin = checkUserLogin;
        
        vm.user = null;
        vm.loginModel = {
            user: null,
            pass: null
        }

        function checkUserLogin()
        {
            if (vm.loginModel.user == 'test' && vm.loginModel.pass == 'test') {
                vm.user = {
                    name: 'Шурыгина Татьяна Николаевна',
                    lpu: 'ГБУЗ "Сахалинская областная клиническая больница"'
                }
            }
        }
    }

})();