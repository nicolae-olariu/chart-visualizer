'use strict';

angular
	.module('chartVisualizerApp')
	.controller('ChartCtrl', function ($scope) {
		$scope.chartDataType = 'tsv';
		$scope.chartDataPath = 'data/sample.tsv';
		$scope.chartXProperty = 'date';
		$scope.chartYProperty = 'close';
		$scope.chartYAxisTitle = 'Profit';

		$scope.types = [
			{ dataType:'csv', dataPath:'data/sample.csv', xProperty: 'time', yProperty: 'revenue', yAxisTitle: 'Kilos' },
		    { dataType:'tsv', dataPath:'data/sample.tsv', xProperty: 'date', yProperty: 'close', yAxisTitle: 'Profit' },
		    { dataType:'json', dataPath:'data/sample.json', xProperty: 'timestamp', yProperty: 'visits', yAxisTitle: 'Visits' }
		];

		var loadData = function() {
			switch ($scope.chartDataType) {
				case 'tsv':
						d3.tsv($scope.chartDataPath, function(error, data) {
							$scope.data = data;
							$scope.$apply();
						});
					break;
				case 'csv':
						d3.csv($scope.chartDataPath, function(error, data) {
							$scope.data = data;

							console.log(data);

							$scope.$apply();
						});
					break;
				case 'json':
						d3.json($scope.chartDataPath, function(error, data) {
							$scope.data = data;
							$scope.$apply();
						});
					break;
			}
		}

		$scope.$watch('m', function(newValue, oldValue) {
			if (newValue != oldValue) {
				$scope.chartDataType = newValue.dataType;
				$scope.chartDataPath = newValue.dataPath;
				$scope.chartXProperty = newValue.xProperty;
				$scope.chartYProperty = newValue.yProperty;
				$scope.chartYAxisTitle = newValue.yAxisTitle;

				loadData();
			}
		});

		loadData();
	});
