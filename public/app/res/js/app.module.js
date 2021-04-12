(function(){
    'use strict';
    angular
        .module('RegPortal', ['ngCookies'])
        .constant('API_URL', `http://${window.location.hostname}`) 
		.config(function($interpolateProvider) {
		  $interpolateProvider.startSymbol('{[{');
		  $interpolateProvider.endSymbol('}]}');
		})
		.config(function ($httpProvider) {
		    $httpProvider.defaults.withCredentials = true;
		});
})()
