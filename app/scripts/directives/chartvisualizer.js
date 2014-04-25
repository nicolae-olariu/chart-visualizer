'use strict';

angular
	.module('chartVisualizerApp')
	.directive('chartVisualizer', function () {
		return {
			scope: {
				chartSelector: '@', 		// eg: chart/graph-chart
				chartSelectorType: '@', 	// eg: ./#
				chartDataSource: '=',		// data to be plotted
				chartXAxisCssClass: '@',	// css class to style the X axis
				chartYAxisCssClass: '@',	// css class to style the Y axis
				chartXAxisTitle: '=',		// title for X axis
				chartShowXAxisTitle: '@',	// show/hide title for X axis
				chartYAxisTitle: '=',		// title for Y axis
				chartShowYAxisTitle: '@',	// show/hide title for Y axis
				chartType: '@',				// type of chart: line-chart/area-chart/bar-chart/pie-chart
				chartXProperty: '=',		// property used to plot each point against x axis (a timestamp)
				chartYProperty: '=',		// property used to plot each point against y axis (usually, a value)
				chartMargins: '=', 			// chart paddings: top/right/bottom/left
				chartHorizGrid: '@', 		// if set, chart will show horizontal grid
				chartVertGrid: '@', 		// if set, chart will show vertical grid
			},
			templateUrl: '/views/chartVisualizer.html',
			restrict: 'AE',
			link: function postLink(scope, element, attrs) {
				var el = element.find('.chart-container');

				// Add state based on chartType: line-chart/area-chart/bar-chart/pie-chart.
				$(el).addClass(scope.chartType);

				switch (scope.chartSelectorType) {
					case '#':
						$(el).attr('id', scope.chartSelector);
						break;
					case '.':
						$(el).addClass(scope.chartSelector);
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

						var margin = scope.chartMargins,
							chart = d3.select(scope.chartSelectorType + scope.chartSelector),
						    width = +chart.style('width').replace('px', '') - margin.left - margin.right,
						    height = +chart.style('height').replace('px', '') - margin.top - margin.bottom,
						    x = d3.time.scale()
						    		.range([0, width]),
							y = d3.scale.linear()
						    		.range([height, 0]),
							xAxis = d3.svg.axis()
								    .scale(x)
								    //.tickSize(-height, 0, 0)
								    .orient('bottom'),
							yAxis = d3.svg.axis()
								    .scale(y)
								    //.tickSize(-width, 0, 0)
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
							data = scope.chartDataSource,
							displayHorizontalGrid = scope.chartHorizGrid && scope.chartHorizGrid === 'true',
							displayVerticalGrid = scope.chartVertGrid && scope.chartVertGrid === 'true',
							displayXAxisTitle = scope.chartXAxisTitle && scope.chartShowXAxisTitle && scope.chartShowXAxisTitle === 'true',
							displayYAxisTitle = scope.chartYAxisTitle && scope.chartShowYAxisTitle && scope.chartShowYAxisTitle === 'true';

						x.domain(d3.extent(data, function(d) { return d[scope.chartXProperty]; }));
						y.domain(d3.extent(data, function(d) { return d[scope.chartYProperty]; }));

						if (displayHorizontalGrid) {
							yAxis.tickSize(-width, 0, 0);
						}

						if (displayVerticalGrid) {
							xAxis.tickSize(-height, 0, 0);
						}

						var xAxisElement = svg.append('g')
											.attr('class', scope.chartXAxisCssClass)
											.attr('transform', 'translate(0,' + height + ')')
											.call(xAxis),
							yAxisElement = svg.append('g')
											.attr('class', scope.chartYAxisCssClass)
											.call(yAxis);

						// Adding oX title.
						if (displayXAxisTitle) {
							xAxisElement
								.append('text')
								//.attr('transform', 'rotate(-90)')
								.attr('x', width / 2)
								.attr('y', margin.bottom / 2)
								.attr('dy', '.71em')
								.style('text-anchor', 'middle')
								.text(scope.chartYAxisTitle);
						}

						// Adding oY title.
						if (displayYAxisTitle) {
							yAxisElement
								.append('text')
								.attr('transform', 'rotate(-90)')
								.attr('x', -height / 2)
								.attr('y', -margin.left / 2)
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
