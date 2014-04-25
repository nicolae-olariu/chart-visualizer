'use strict';

angular
	.module('chartVisualizerApp')
	.controller('ChartCtrl', function ($scope, Data) {
		/*-------------------------------------------------------------------
		 *
		 * Properties
		 *
		 *-----------------------------------------------------------------*/

		// Used just for testing purposes.
		$scope.useThisTypeIndexAsDefault = 0;
		$scope.types = [
			{ dataType:'csv', dataPath:'data/sample.csv', xProperty: 'time', yProperty: 'revenue', xAxisTitle: 'Time', yAxisTitle: 'Kilos' },
		    { dataType:'tsv', dataPath:'data/sample.tsv', xProperty: 'date', yProperty: 'close', xAxisTitle: 'Date', yAxisTitle: 'Profit' },
		    { dataType:'json', dataPath:'data/sample.json', xProperty: 'timestamp', yProperty: 'visits', xAxisTitle: 'Timestamp',  yAxisTitle: 'Visits' }
		];
		$scope.type = $scope.types[$scope.useThisTypeIndexAsDefault];

		// Defaults chart margins.
		$scope.chartMargins = { top: 20, right: 20, bottom: 50, left: 100 };

		var setDefaults = function() {
				$scope.chartDataType = $scope.types[$scope.useThisTypeIndexAsDefault].dataType;
				$scope.chartDataPath = $scope.types[$scope.useThisTypeIndexAsDefault].dataPath;
				$scope.chartXProperty = $scope.types[$scope.useThisTypeIndexAsDefault].xProperty;
				$scope.chartYProperty = $scope.types[$scope.useThisTypeIndexAsDefault].yProperty;
				$scope.chartYAxisTitle = $scope.types[$scope.useThisTypeIndexAsDefault].yAxisTitle;
				$scope.chartXAxisTitle = $scope.types[$scope.useThisTypeIndexAsDefault].xAxisTitle;
			},
			getData = function() {
				Data.loadData($scope.chartDataType, $scope.chartDataPath).promise.then(function(data) {
					$scope.data = data;
				});
			},
			watchDropDown = function() {
				$scope.$watch('type', function(newValue, oldValue) {
					if (newValue != oldValue) {
						$scope.chartDataType = newValue.dataType;
						$scope.chartDataPath = newValue.dataPath;
						$scope.chartXProperty = newValue.xProperty;
						$scope.chartYProperty = newValue.yProperty;
						$scope.chartXAxisTitle = newValue.xAxisTitle;
						$scope.chartYAxisTitle = newValue.yAxisTitle;

						getData();
					}
				});
			},
			initialize = function() {
				setDefaults();
				watchDropDown();
				getData();
			};

		initialize();
	});
