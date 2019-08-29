(function(){
    'use strict';
    angular
        .module('RegPortal')
        .factory('ApiFactory', [
            '$http', 
            'API_URL',
            ApiFactory
        ]);

    function ApiFactory($http, API_URL){

        function parseUrl(url){
            return `${API_URL}/${url.join('/')}`;
        }

        return {
            read: function(url, data){
                return $http({
                    url: parseUrl(url),
                    data: data,
                    method: 'GET',
                })
            },
            create: function(url, data){
                return $http({
                    url: parseUrl(url),
                    data: data,
                    method: 'POST'
                })
            },
            update: function(url, data){
                return $http({
                    url: parseUrl(url),
                    data: data,
                    method: 'PUT'
                })
            },
            delete: function(url, data){
                return $http({
                    url: parseUrl(url),
                    data: data,
                    method: 'DELETE'
                })
            }


        };
    }
})(); 
