'use strict';

angular
	.module('chartVisualizerApp')
	.service('Colors', function Colors() {
		var colors = {},
			lettersSeed = '0123456789ABCDEF';

		colors.getRandomColor = function() {
			var letters = lettersSeed.split(''),
				color = '#';

			for (var i = 0; i < 6; i++ ) {
				color += letters[Math.floor(Math.random() * 16)];
			}

			return color;
		};

		return colors;
	});
