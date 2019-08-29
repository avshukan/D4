(function(){
    'use strict';
    angular
        .module('RegPortal')
        .controller('CheckController', [
            'ApiFactory',
             CheckController
        ]);

    function CheckController(ApiFactory)
    {
        const vm = this;
        
        // Ctr models
        vm.checks = null;
        vm.checkEditorModel = null;

        // Ctr methods
        vm.getUser = getUser;
        vm.getChecks = getChecks;
        vm.saveChecks = saveChecks;

        function getUser()
        {
            const formData = new FormData();
        
            formData.append('polis', '123');


            ApiFactory.get([''], formData)
                .then((res) => { vm.user = res.data; }, 
                      (res) => { console.error(res); });
        }
        
        function getChecks()
        {
            ApiFactory.get(['checks'])
                .then((res) => { vm.checks = res.data; }, 
                      (res) => { console.error(res); });
        }

        function saveChecks()
        {

            ApiFactory.save(['checks', 2], vm.checkEditorModel)
                .then((res) => { console.error(res); }, 
                      (res) => { console.error(res); });
        }

        // function putChecks()
        // {
        //     ApiFactory.put(['checks'], vm.user)
        //         .then((res) => { vm.user = res.data; }, 
        //               (res) => { console.error(res); });
        // }
    }

})();