(function(){
    'use strict';
    angular
        .module('RegPortal', ['ngCookies'])
        .constant('API_URL', 'http://10.6.0.159')
		.config(function($interpolateProvider) {
		  $interpolateProvider.startSymbol('{[{');
		  $interpolateProvider.endSymbol('}]}');
		})
		.config(function ($httpProvider) {
		    $httpProvider.defaults.withCredentials = true;
		});
})()