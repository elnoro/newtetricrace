window.onload = function (argument) {
		// 'use strict';
		canvas = document.getElementsByTagName('canvas')[0];
		ctx    = canvas.getContext('2d');

		var GameCanvas = {
			drawGrass: function() {
				ctx.drawImage(bg_grass, 0, 0);
				return this;
			},
			drawRoad: function() {
				ctx.fillStyle = '#AAA';
				ctx.fillRect(120, 0, 60, 300);

				ctx.fillStyle = '#fff';
				var road_stripe_start = 0;
				while (road_stripe_start < 300) {
					ctx.fillRect(148, road_stripe_start, 4, 10);
					road_stripe_start += 15;
				}
				return this;
			},
			drawCar: (function(car_x, car_y) {
				return function (add_x, add_y) {
					if (car_x + add_x > 180 - 14) { car_x = 180 - 14; }
					else {
						if (car_x + add_x < 120) { car_x = 120; }
						else { car_x += add_x; }
					}
					ctx.drawImage(car_img, car_x, car_y);
					return this;
				};
			}(154, 300 - 22)),
			redrawCar: function (add_x, add_y) {
				this.drawGrass().drawRoad().drawCar(-add_x, -add_y);
			}
		};

		function bindKeys () {
			window.addEventListener('keydown', function (event) {	
				switch(event.keyCode) {
					case 37:
						GameCanvas.redrawCar(10, 0);
						break;
					case 39:
						GameCanvas.redrawCar(-10, 0);
						break;
					default:
						console.log('Press left and right arrows');
				}
			});
		}

		var bg_grass = new Image();
		bg_grass.onload = function () {
			car_img = new Image();
			car_img.onload = function () {
				GameCanvas.drawGrass().drawRoad().drawCar(0, 0);
				bindKeys();
			};
			car_img.src = 'car.png';
		};
		bg_grass.src = 'grass.png';
};
