'use strict';

angular
	.module('chartVisualizerApp')
	.controller('ChartCtrl', function ($scope) {
		/*-------------------------------------------------------------------
		 *
		 * Properties
		 *
		 *-----------------------------------------------------------------*/

		// Used just for testing purposes.
		$scope.types = [
			{ dataType:'csv', dataPath:'data/sample.csv', xProperty: 'time', yProperty: 'revenue', xAxisTitle: 'Time', yAxisTitle: 'Kilos' },
		    { dataType:'tsv', dataPath:'data/sample.tsv', xProperty: 'date', yProperty: 'close', xAxisTitle: 'Date', yAxisTitle: 'Profit' },
		    { dataType:'json', dataPath:'data/sample.json', xProperty: 'timestamp', yProperty: 'visits', xAxisTitle: 'Timestamp',  yAxisTitle: 'Visits' }
		];

		/*------------------------------------------------------------------
		Defaults
		------------------------------------------------------------------*/

		$scope.chartDataType = $scope.types[0].dataType;
		$scope.chartDataPath = $scope.types[0].dataPath;
		$scope.chartXProperty = $scope.types[0].xProperty;
		$scope.chartYProperty = $scope.types[0].yProperty;
		$scope.chartYAxisTitle = $scope.types[0].yAxisTitle;
		$scope.chartXAxisTitle = $scope.types[0].xAxisTitle;
		$scope.chartMargins = { top: 20, right: 20, bottom: 50, left: 100 };

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
				$scope.chartXAxisTitle = newValue.xAxisTitle;
				$scope.chartYAxisTitle = newValue.yAxisTitle;

				loadData();
			}
		});

		loadData();
	});
