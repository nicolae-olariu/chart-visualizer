'use strict';

angular
	.module('chartVisualizerApp')
	.directive('chartVisualizer', function () {
		return {
			scope: {
				chartSelector: '@',
				chartSelectorType: '@',
				chartDataSource: '=',
				chartXAxisCssClass: '@',
				chartYAxisCssClass: '@',
				chartXAxisTitle: '=',
				chartYAxisTitle: '=',
				chartType: '@',
				chartXProperty: '=',
				chartYProperty: '='
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

				var initialize = function() {
						formatDataSource();
						plotChart();
					},
					plotChart = function() {
						$(scope.chartSelectorType + scope.chartSelector).children().remove();

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
								    .orient('bottom'),
							yAxis = d3.svg.axis()
								    .scale(y)
								    .orient('left'),
							line = d3.svg.line()
								    .x(function(d) { return x(d[scope.chartXProperty]); })
								    .y(function(d) { return y(d[scope.chartYProperty]); }),
							svg = d3.select(scope.chartSelectorType + scope.chartSelector)
									.append('svg')
								    .attr('width', width + margin.left + margin.right)
								    .attr('height', height + margin.top + margin.bottom)
									 	.append('g')
									    	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
							data = scope.chartDataSource;

						x.domain(d3.extent(data, function(d) { return d[scope.chartXProperty]; }));
						y.domain(d3.extent(data, function(d) { return d[scope.chartYProperty]; }));

						var xAxisElement = svg.append('g')
											.attr('class', scope.chartXAxisCssClass)
											.attr('transform', 'translate(0,' + height + ')')
											.call(xAxis),
							yAxisElement = svg.append('g')
											.attr('class', scope.chartYAxisCssClass)
											.call(yAxis);

						// Adding oY title.
						if (scope.chartYAxisTitle) {
							yAxisElement
								.append('text')
								.attr('transform', 'rotate(-90)')
								.attr('x', -height / 2)
								.attr('y', 10)
								.attr('dy', '.71em')
								.style('text-anchor', 'middle')
								.text(scope.chartYAxisTitle);
						}

						svg.append('path')
							.datum(data)
							.attr('class', 'line')
							.attr('d', line);
					},
					formatDataSource = function() {
						scope.chartDataSource.forEach(function(d) {
							d[scope.chartXProperty] = d3.time.format('%d-%b-%y').parse(d[scope.chartXProperty]);
							d[scope.chartYProperty] = +d[scope.chartYProperty];
						});
					};

				initialize();

				scope.$watch('chartDataSource', function(newVal, oldVal) {
					if (newVal != oldVal) {
						initialize();
					}
				});
			}
		};
	});
