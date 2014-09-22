'use strict';

angular
	.module('chartVisualizerApp')
	.directive('chartVisualizer', function (Colors) {
		return {
			scope: {
				chartSelector: '@', 			// eg: chart/graph-chart
				chartSelectorType: '@', 		// eg: ./#
				chartDataSource: '=',			// data to be plotted
				chartXAxisCssClass: '@',		// css class to style the X axis
				chartYAxisCssClass: '@',		// css class to style the Y axis
				chartXAxisTitle: '=',			// title for X axis
				chartShowXAxisTitle: '@',		// show/hide title for X axis
				chartYAxisTitle: '=',			// title for Y axis
				chartShowYAxisTitle: '@',		// show/hide title for Y axis
				chartType: '@',					// type of chart: line-chart/area-chart/bar-chart/pie-chart
				chartXProperty: '=',			// property used to plot each point against x axis (a timestamp)
				chartYProperty: '=',			// property used to plot each point against y axis (usually, a value)
				chartMargins: '=', 				// chart paddings: top/right/bottom/left
				chartHorizGrid: '@', 			// if set, chart will show horizontal grid
				chartVertGrid: '@', 			// if set, chart will show vertical grid
				chartXAxisTitleCssClass: '=',	// default class: xAxisTitle
				chartYAxisTitleCssClass: '=', 	// default class: yAxisTitle
				formatCurrency: '='
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
						plotLineChart();
					},
					plotLineChart = function() {
						$(scope.chartSelectorType + scope.chartSelector).children().remove();

						var margin = scope.chartMargins,
							chart = d3.select(scope.chartSelectorType + scope.chartSelector),
						    width = +chart.style('width').replace('px', '') - margin.left - margin.right,
						    height = +chart.style('height').replace('px', '') - margin.top - margin.bottom,

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
							displayYAxisTitle = scope.chartYAxisTitle && scope.chartShowYAxisTitle && scope.chartShowYAxisTitle === 'true',
							tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

						for (var i = 0, ii = scope.chartDataSource.length; i < ii; i++) {
							if (typeof scope.chartDataSource[i] === 'number') {
								setMessage('Loading...');

								return;
							}
						}

						if (!scope.chartDataSource || scope.chartDataSource.length === 0) {
							setMessage('No celebrity selected!');

							return;
						}

						function setMessage (msg) {
					        svg
					          .append('text')
					          .attr('x', width / 2)
					          .attr('y', height / 2)
					          .attr('class', 'axis-title')
					          .attr('text-anchor', 'middle')
					          .attr('fill', '#999')
					          .attr('font-size', '16px')
					          .text(msg);
					    };

					var yMaxValues = [],
						yMinValues = [],
						xMaxValues = [],
						xMinValues = [];

					for (var i = 0, length = data.length; i < length; i++) {
						if (data[i] && data[i].values) {
							// Get maximum y values for each data set.
							yMaxValues[yMaxValues.length] = d3.max(data[i].values, function(d) { return +d[scope.chartYProperty] || 0; });

							// Get minimum y values for each data set.
							yMinValues[yMinValues.length] = d3.min(data[i].values, function(d) { return +d[scope.chartYProperty] || 0; });

							// Get maximum x values for each data set.
							xMaxValues[xMaxValues.length] = d3.max(data[i].values, function(d) { return d[scope.chartXProperty]; });

							// Get minimum x values for each data set.
							xMinValues[xMinValues.length] = d3.min(data[i].values, function(d) { return d[scope.chartXProperty]; });
						}
					}

					var xMin = d3.min(xMinValues),
						xMax = d3.max(xMaxValues),
						yMin = d3.min(yMinValues),
						yMax = d3.max(yMaxValues);

					var initialLine = d3.svg.line()
					    	.x(function(d) { return x(d[scope.chartXProperty]); })
					    	.y(function(d) { return  y(yMin); }),
						line = d3.svg.line()
							    .x(function(d) { return x(d[scope.chartXProperty]); })
							    .y(function(d) { return y(d[scope.chartYProperty]); });

					var dateFormats = {
						day: '%H:%M',
						week: '%a',
						month: '%d',
						year: '%b'
					};

					var gridSubdivision,
						scaleType;

					switch(scope.chartDataSource[0].period) {
						case 'today' :
							scaleType = d3.time.format(dateFormats.day);
							gridSubdivision = 13;
							break;
						case 'week' :
							scaleType = d3.time.format(dateFormats.week);
							gridSubdivision = 8;
							break;
						case 'month' :
							scaleType = d3.time.format(dateFormats.month);
							gridSubdivision = 31;
							break;
						case 'year' :
							scaleType = d3.time.format(dateFormats.year);
							gridSubdivision = 13;
							break;
					}

					var // Prepare x scale.
			        x = d3.time
			              .scale()
			              .domain([xMin, xMax]) // just for today
			              .range([0, width]),


			        // Prepare y scale.
			        y = d3.scale
			              .linear()
			              .domain([0, yMax])
			              .range([height, 0]),

						xAxis = d3.svg.axis()
							    .scale(x)
							    .orient('bottom')
							    .tickPadding(15)
							    //.ticks(gridSubdivision)
							    .tickFormat(scaleType);

						if(yMax <= 10) {
							var yAxis = d3.svg.axis()
							    .scale(y)
							    .orient('left')
							    .tickPadding(15)
							    .ticks(yMax);
						} else {
							var yAxis = d3.svg.axis()
							    .scale(y)
							    .orient('left')
							    .tickPadding(15);
						}


						// Show/hide horizontal grid.
						if (displayHorizontalGrid) {
							yAxis.tickSize(-width, 0, 0);
						}

						// Show/hide vertical grid.
						if (displayVerticalGrid) {
							xAxis.tickSize(-height, 0, 0);
						}

						var xAxisElement = svg.append('g')
											.attr('class', scope.chartXAxisCssClass)
											.attr('transform', 'translate(0,' + height + ')')
											.call(xAxis)
											.selectAll("text")
						            .style("text-anchor", "end")
						            .attr("dx", "-.8em")
						            .attr("dy", "-.4em")
						            .attr("transform", function(d) {
					                return "rotate(-65)"
				                }),
							yAxisElement = svg.append('g')
											.attr('class', scope.chartYAxisCssClass)
											.call(yAxis);

						// Adding oX title.
						if (displayXAxisTitle) {
							xAxisElement
								.append('text')
								.attr('transform', 'translate(0,' + -height + ')')
								.attr('x', width / 2)
								.attr('y', margin.bottom / 2)
								.attr('dy', '.71em')
								.attr('class', scope.chartXAxisTitleCssClass || 'xAxisTitle')
								.style('text-anchor', 'middle')
								.text(scope.chartXAxisTitle);
						}

						// Adding oY title.
						if (displayYAxisTitle) {
							yAxisElement
								.append('text')
								.attr('transform', 'rotate(-90)')
								.attr('x', -height / 2)
								.attr('y', -margin.left / 2)
								.attr('dy', '.71em')
								.attr('class', scope.chartYAxisTitleCssClass || 'yAxisTitle')
								.style('text-anchor', 'middle')
								.text(scope.chartYAxisTitle);
						}

						var circles = [];

						var tooltip = d3.select("body")
								    .append("div")
								    .style("position", "absolute")
								    .style("z-index", "10")
								    .style("display", "none")
								    .style("background", "#fff")
								    .style("border", '1px solid')
								    .style("border-radius", '5px')
								    .style("padding", '5px')
								    .text("a simple tooltip");

						for(var i = 0, ii = data.length; i < ii; i++) {
							(function(index) {
								svg.append('path')
									.datum(data[index].values)
									.attr('class', 'line')
									.attr('d', initialLine)
									.transition()
									.duration(1000)
									.attr('d', line)
									.attr('stroke', data[index].color || d3.scale.category20().range()[index])
									.each('end', function() {
										circles[index]
											.transition()
											.delay(100)
											.attr('r', 5)
											.style('opacity', 1)
									})

									var circle = svg
										.selectAll('dot')
										.data(data[index].values)
										.enter()
										.append('circle')
											.attr('data-value', function(d) { return d[scope.chartYProperty]; })
											.attr('r', 0)
											.attr('stroke', '#fff')
											.attr('stroke-width', 2)
											.attr('fill', data[index].color || d3.scale.category20().range()[index])
											.attr('cx', function (d) { return x(d[scope.chartXProperty]) })
											.attr('cy', function (d) { return y(d[scope.chartYProperty]) })
											.style('opacity', 0)

									circles[circles.length] = circle;
								})(i);

								svg.selectAll('circle')
									.on("mouseover", function() {
										var currCircle = d3.select(this);

										currCircle
											.transition()
											.attr('r', 7);

										tooltip
											.style("border-color",  currCircle.attr('fill') ) //currCircle.fill()
											.html(capitalize(scope.chartYProperty) + ": " + formatDataValue( currCircle.attr('data-value') ) );

										return tooltip.style("display", "block");
									})
								.on("mousemove", function(){return tooltip.style("top",
								    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
								.on("mouseout", function(){
									var currCircle = d3.select(this);

									currCircle
										.transition()
										.attr('r', 5);

									return tooltip.style("display", "none");
								});
						}

						function capitalize (string) {
							return string[0].toUpperCase() + string.slice(1, string.length);
						};

						function formatDataValue(data) {
							if(scope.chartYProperty === "amount") {
								return scope.formatCurrency(data, 2);
							} else return data;
						}
					};

				initialize();

				$(window).on('resize', _.debounce(plotLineChart, 100));

				scope.$watch(function () {
					return scope.chartDataSource;
				}, function(newVal, oldVal) {
					if (newVal != oldVal) {
						initialize();
					}
				}, true);

				scope.$watch(function () {
					return scope.chartYProperty;
				}, function(newVal, oldVal) {
					if (newVal != oldVal) {
						initialize();
					}
				});

			}
		};
	});
