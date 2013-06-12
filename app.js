window.onload = function (argument) {
		// 'use strict';
		var canvas = document.getElementsByTagName('canvas')[0],
			ctx = canvas.getContext('2d');

		function Obstacle (side, road) {
			var halfOfRoad = (road.rightEdge - road.leftEdge) / 2,
				x = (side === 0) ? road.leftEdge : road.leftEdge + halfOfRoad;
			this.gap = 0;
			this.leftEdge = x;
			this.rightEdge = x + 30; // x + width
			this._draw = function () {
				ctx.drawImage(this.obs_img, x, this.gap);
				this.gap += Game.speed;
				if (this.gap > canvas.height) {
					Game.Objects.pool.obstacles.shift();
				}
			};
		}
		function Background(bg_img) {
			this._draw = function () {
				ctx.drawImage(bg_img, 0, 0);
			};
		}

		function Road (x, width, style) {
			this.leftEdge = x;
			this.rightEdge = x + width;
			this._draw = function () {
				ctx.fillStyle = style;
				ctx.fillRect(x, 0, width, canvas.height);
			};
		}

		function Stripes(width, height, gap, road) {
			this._draw = function() {
				if (this.start > gap + height) { this.start -= gap + height; }
				var start = this.start;
				ctx.fillStyle = '#fff';
				while (this.start < canvas.height) {
					ctx.fillRect(
						road.leftEdge + (road.rightEdge - road.leftEdge)/2,
						this.start,
						width,
						height
					);
					this.start += gap + height;
				}
				this.start = start;
			};
			this.start = 0;
		}

		function Car(img, x, y, road) {
			var width = 14,
				step = 5;
			this._draw = function() {
				ctx.drawImage(img, x, y);
			};
			
			Object.defineProperties(this, {
				'leftEdge': {get: function () { return x; }},
				'rightEdge': {get: function () { return x + width; }}
			});

			this.stepLeft = function() {
				x-=step;
				if (x < road.leftEdge) {
					x = road.leftEdge;
				}
			};
			this.stepRight = function() {
				x+=step;
				if (x +width > road.rightEdge) {
					x = road.rightEdge - width;
				}
			};
		}


		var Game = {
			speed: 0.9,
			Objects: {
				drawAll: function() {
					this.pool.bg._draw();
					this.pool.road._draw();
					this.pool.stripes._draw();
					this.pool.car._draw();
					for (var i = 0; i < this.pool.obstacles.length; i++) {
						this.pool.obstacles[i]._draw();
					}
				},
				pool: {},
				create: function(bg_img, car_img) {
					var road = new Road(120, 60, '#aaa');
					this.pool.road = new Road(120, 60, '#aaa');
					this.pool.stripes = new Stripes(2, 5, 5, this.pool.road);
					this.pool.car = new Car(car_img, 154, 300-22, this.pool.road);
					this.pool.bg = new Background(bg_grass);
					this.pool.obstacles = [];
				}
			},
			bindMovements : function (car) {
				var _this = this;
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
			},
			animationLoop : function (gameLoop) {
				this.Objects.drawAll();
				var _this = this;
				if (gameLoop(this.Objects.pool)) {
					mozRequestAnimationFrame(function () {
						_this.animationLoop(gameLoop);
					});
				}
				else {
					Game.gameOver();
				}
			},
			gameOver: function () {
				alert('Game over!');
			}
		};

		// Initialization

		var bg_grass = new Image(),
			car_img = new Image(),
			obs_img = new Image();

		obs_img.onload = function () {
			Obstacle.prototype.obs_img = obs_img;
			bg_grass.onload = function () {
				car_img.onload = function () {
					Game.Objects.create(bg_grass, car_img, obs_img);
					Game.bindMovements(Game.Objects.pool.car);
					function checkIntersections(obstacles, car) {
						for (var i = 0; i < obstacles.length; i++) {
							if (obstacles[i].rightEdge > car.leftEdge && 
								obstacles[i].leftEdge < car.rightEdge &&
								obstacles[i].gap > 300-20) {
									return true;
							}
						}
						return false;
					}
					var gameLoop = (function () {
						var side = 0;
						var max_counts = 50, counts = 0 ;
						return function(pool) {
							if (counts > max_counts) {
								side = (Math.random() > 0.5) ? 1 : 0;
								pool.obstacles.push(new Obstacle(side, pool.road));
								counts = 0;
								max_counts = 50 + Math.random()*100;
							}
							else {
								counts++;
							}
							pool.stripes.start += Game.speed;
							return !checkIntersections(pool.obstacles, pool.car);
						};
					}());
					Game.animationLoop(gameLoop);
				};
				car_img.src = 'car.png';
			};
			bg_grass.src = 'grass.png';
		};
		obs_img.src = 'obstacle.png';
};
