'use strict';

angular
	.module('chartVisualizerApp')
	.service('Data', function Data($q) {
		var service = {};

		service.loadData = function(dataType, dataPath) {
			var d = $q.defer();

			switch (dataType) {
				case 'tsv':
					d3.tsv(dataPath, function(error, data) {
						d.resolve(data);
					});
					break;
				case 'csv':
					d3.csv(dataPath, function(error, data) {
						d.resolve(data);
					});
					break;
				case 'json':
					d3.json(dataPath, function(error, data) {
						d.resolve(data);
					});
					break;
			}

			return d;
		};

		return service;
	});
