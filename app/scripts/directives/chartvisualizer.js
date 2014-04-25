'use strict';

angular
	.module('chartVisualizerApp')
	.directive('chartVisualizer', function () {
		return {
			scope: {
				chartSelector: '@',
				chartSelectorType: '@',
				chartXAxisTitle: '@',
				chartYAxisTitle: '@',
				chartType: '@',
				chartDataType: '@',
				chartDataPath: '@',
				chartXProperty: '@',
				chartYProperty: '@'
			},
			templateUrl: '/views/chartVisualizer.html',
			restrict: 'AE',
			link: function postLink(scope, element, attrs) {
				var el = element.find('.chart-container');

				switch (scope.chartSelectorType) {
					case '#':
						el.attr('id', scope.chartSelector);
						break;
					case '.':
						el.attr('class', scope.chartSelector);
						break;
				}

				/*-------------------------------------------------------------------
				 *
				 * Properties
				 *
				 *-----------------------------------------------------------------*/

				scope.data = [];

				/*-------------------------------------------------------------------
				 *
				 * Methods
				 *
				 *-----------------------------------------------------------------*/

				var loadData = function() {
						switch (scope.chartDataType) {
							case 'tsv':
									d3.tsv(scope.chartDataPath, function(error, data) {
										data.forEach(function(d) {
											d[scope.chartXProperty] = d3.time.format("%d-%b-%y").parse(d[scope.chartXProperty]);
											d[scope.chartYProperty] = +d[scope.chartYProperty];
										});

										scope.data = data;
										scope.$apply();
									});
								break;
							case 'csv':
									d3.csv(scope.chartDataPath, function(error, data) {
										data.forEach(function(d) {
											d[scope.chartXProperty] = d3.time.format("%d-%b-%y").parse(d[scope.chartXProperty]);
											d[scope.chartYProperty] = +d[scope.chartYProperty];
										});

										scope.data = data;
										scope.$apply();
									});
								break;
							case 'json':
									d3.json(scope.chartDataPath, function(error, data) {
										data.forEach(function(d) {
											d[scope.chartXProperty] = d3.time.format("%d-%b-%y").parse(d[scope.chartXProperty]);
											d[scope.chartYProperty] = +d[scope.chartYProperty];
										});

										scope.data = data;
										scope.$apply();
									});
								break;
						}
					},
					plotChart = function() {
						var margin = { top: 20, right: 20, bottom: 30, left: 50 },
							chart = d3.select(scope.chartSelectorType + scope.chartSelector),
						    width = +chart.style('width').replace('px', '') - margin.left - margin.right,
						    height = +chart.style('height').replace('px', '') - margin.top - margin.bottom,
						    x = d3.time.scale()
						    		.range([0, width]),
							y = d3.scale.linear()
						    		.range([height, 0]),
							xAxis = d3.svg.axis()
								    .scale(x)
								    .orient("bottom"),
							yAxis = d3.svg.axis()
								    .scale(y)
								    .orient("left"),
							line = d3.svg.line()
								    .x(function(d) { return x(d[scope.chartXProperty]); })
								    .y(function(d) { return y(d[scope.chartYProperty]); }),
							svg = d3.select(scope.chartSelectorType + scope.chartSelector)
									.append("svg")
								    .attr("width", width + margin.left + margin.right)
								    .attr("height", height + margin.top + margin.bottom)
									  .append("g")
									    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
							data = scope.data;

						x.domain(d3.extent(data, function(d) { return d[scope.chartXProperty]; }));
						y.domain(d3.extent(data, function(d) { return d[scope.chartYProperty]; }));

						var xAxisElement = svg.append("g")
											.attr("class", "x axis")
											.attr("transform", "translate(0," + height + ")")
											.call(xAxis),
							yAxisElement = svg.append("g")
											.attr("class", "y axis")
											.call(yAxis);

						if (scope.chartYAxisTitle) {
							yAxisElement
								.append("text")
								.attr("transform", "rotate(-90)")
								.attr("y", 6)
								.attr("dy", ".71em")
								.style("text-anchor", "end")
								.text(scope.chartYAxisTitle);
						}

						svg.append("path")
							.datum(data)
							.attr("class", "line")
							.attr("d", line);
					};

				/*------------------------------------------------------------------
				Watchers
				------------------------------------------------------------------*/

				scope.$watch('data', function(newValue, oldValue) {
					if (newValue != oldValue)
						plotChart();
				});

				/*------------------------------------------------------------------
				Init
				------------------------------------------------------------------*/

				loadData();
			}
		};
	});
