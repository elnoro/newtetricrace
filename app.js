window.onload = function (argument) {
		// 'use strict';
		canvas = document.getElementsByTagName('canvas')[0];
		ctx    = canvas.getContext('2d');

		function Obstacle (side, road) {
			var halfOfRoad = (road.rightEdge - road.leftEdge) / 2,
				x = (side === 0) ? road.leftEdge : road.leftEdge + halfOfRoad;
			this.gap = 0;
			this._draw = function () {
				ctx.fillStyle = '#f00';
				ctx.fillRect(x, this.gap, halfOfRoad, 20);
			};
		}
		var createBG = function(bg_img) {
			return {
				_draw: function () {
					ctx.drawImage(bg_img, 0, 0);
				}
			};
		};

		var createRoad = function (x, width, style) {
			return {
				leftEdge: x,
				rightEdge: x + width,
				_draw: function () {
					ctx.fillStyle = style;
					ctx.fillRect(x, 0, width, canvas.height);
				}
			};
		};

		var createStripes = function(width, height, gap, road) {
			return {
				_draw: function() {
					if (this.start > gap + height) { this.start -= gap + height; }
					var start = this.start; 
					ctx.fillStyle = '#fff';
					while (this.start < canvas.height) {
						ctx.fillRect(road.leftEdge + (road.rightEdge - road.leftEdge)/2, this.start, width, height);
						this.start += gap + height;
					}
					this.start = start;
				},
				start: 0
			};
		};

		var createCar = function(img, x, y, road) {
			var width = 14,
				step = 5;
			return {
				_draw: function() {
					ctx.drawImage(img, x, y);
				},
				stepLeft: function() {
					x-=step;
					if (x < road.leftEdge) {
						x = road.leftEdge;
					}
				},
				stepRight: function() {
					x+=step;
					if (x +width > road.rightEdge) {
						x = road.rightEdge - width;
					}
				}
			};
		};

		function bindMovements (car) {
			window.addEventListener('keydown', function (event) {	
				switch(event.keyCode) {
					case 37:
						car.stepLeft();
						break;
					case 39:
						car.stepRight();
						break;
				}
			});
			document.getElementsByTagName('button')[0].addEventListener('click', function () { car.stepLeft(); });
			document.getElementsByTagName('button')[1].addEventListener('click', function () { car.stepRight(); });
		}

		function startAnimationLoop (objects_to_render, gameLoop) {
			(function animationLoop () {
				var i;
				for (i = 0; i < objects_to_render.length; i++) {
					objects_to_render[i]._draw();
				}
				if (gameLoop()) {
					requestAnimationFrame(animationLoop);
				}
			}());
		}

		var bg_grass = new Image();
		bg_grass.onload = function () {
			car_img = new Image();
			car_img.onload = function () {
				var road = createRoad(120, 60, '#aaa'),
					stripes = createStripes(2, 5, 5, road),
					car = createCar(car_img, 154, 300-22, road),
					bg = createBG(bg_grass);
				bindMovements(car);
				var game_objects = [bg, road, stripes, car];
				var i, obstacles = {}, side;
				for (i = 0; i < 20; i++) {
					side = (Math.random() > 0.5) ? 1:0;
					obstacles[Math.floor(Math.round()*2000)] = new Obstacle(side, road);
				}
				var shots = 0;
				startAnimationLoop(game_objects, function() {
					stripes.start += 0.5;
					if (obstacles.hasOwnProperty(shots)) {
						game_objects.push(obstacles[shots]);
					}
					shots++;
					return true;
				});
			};
			car_img.src = 'car.png';
		};
		bg_grass.src = 'grass.png';
};
