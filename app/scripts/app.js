'use strict';

angular
	.module('chartVisualizerApp', [
		'ngCookies',
		'ngResource',
		'ngSanitize',
		'ngRoute',
		'nvd3ChartDirectives'
		])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/chart', {
				templateUrl: 'views/chart.html',
				controller: 'ChartCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
