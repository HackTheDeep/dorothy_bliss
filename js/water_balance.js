var loader = new PxLoader();

var imageList = [
	"sand",
	"crab",
	"crab_bulging1",
	"crab_bulging2",
	"crab_evil",
	"grass1",
	"grass2"
];

var images = {};

var keys = {};

var canvas;
var ctx;

var objects = [];
var pool1food = [];
var pool2food = [];

var foodTimer = 0;

var crab = new Crab();
crab.x = crab.y = 300;
objects.push(crab);

var evilCrab = new EvilCrab(crab);
evilCrab.x = evilCrab.y = 400;
objects.push(evilCrab);

var pool1 = new Pool();
pool1.x = 165;
pool1.y = 495;
pool1.a = 112.5;
pool1.b = 52;
objects.push(pool1);

var pool2 = new Pool();
pool2.x = 593;
pool2.y = 442;
pool2.a = 112.5;
pool2.b = 52;
objects.push(pool2);

var updateArray = function(array) {
	array.forEach(function(object) {
		object.update({
			pool1: pool1,
			pool2: pool2,
			pool1food: pool1food,
			pool2food: pool2food
		});
	});
};

var drawArray = function(array, ctx, images) {
	array.forEach(function(object) {
		object.draw(ctx, images);
	});
};

var generateFood = function(food, pool, poolArray) {
	var food = new Food();
	// from https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
	var theta = Math.floor((Math.random()*360) + 1);
	var quadrant = Math.floor((Math.random()*4) + 1);
	var a = pool.a;
	var b = pool.b;
	var x = (a * b) / (Math.sqrt(Math.pow(b, 2) + (Math.pow(a, 2) * Math.pow(Math.tan(theta), 2))));
	var y = (a * b) / (Math.sqrt(Math.pow(a, 2) + (Math.pow(b, 2) / Math.pow(Math.tan(theta), 2))));
	if (quadrant == 1) {
		x = Math.abs(x);
		y = Math.abs(y);
	} else if (quadrant == 2) {
		x = -Math.abs(x);
		y = Math.abs(y);
	} else if (quadrant == 3) {
		x = -Math.abs(x);
		y = -Math.abs(y);
	} else if (quadrant == 4) {
		x = Math.abs(x);
		y = -Math.abs(y);
	}
	food.x = pool.x + x - (food.width / 2);
	food.y = pool.y + y - food.height;
	poolArray.push(food);
};

var loop = function() {
	// food generation
	if (pool1food.length < 3) {
		if (foodTimer > 60*3) {
			generateFood(pool1food, pool1, pool1food);
		} else {
			foodTimer++;
		}
	}
	if (pool2food.length < 3) {
		if (foodTimer > 60*3) {
			generateFood(pool2food, pool2, pool2food);
		} else {
			foodTimer++;
		}
	}

	// update
	updateArray(objects);
	updateArray(pool1food);
	updateArray(pool2food);

	// input
	if (keys[37]) { // left
		crab.x--;
	}
	if (keys[38]) { // up
		crab.y--;
	}
	if (keys[39]) { // right
		crab.x++;
	}
	if (keys[40]) { // down
		crab.y++;
	}

	// draw
	ctx.drawImage(images.sand, 0, 0);

	drawArray(objects, ctx, images);
	drawArray(pool1food, ctx, images);
	drawArray(pool2food, ctx, images);

	ctx.fillStyle = "black";
	ctx.font = "14px Arial";
	ctx.fillText("Salinity: " + crab.salinity + "%", 10, 24); 
	ctx.fillText("Food: " + crab.food + "%", 10, 48); 

	window.requestAnimationFrame(loop);
};

var keychange = function(down, e) {
	keys[e.keyCode] = down;
};

$(document).ready(function() {
	imageList.forEach(function(imageName) {
		images[imageName] = loader.addImage("img/water_balance/" + imageName + ".png");
	});

	loader.addCompletionListener(function() {
		canvas = document.querySelector("canvas");
		ctx = canvas.getContext("2d");

		window.addEventListener("keydown", this.keychange.bind(this, true), false);
		window.addEventListener("keyup", this.keychange.bind(this, false), false);

		while (pool1food.length < 3) {
			generateFood(pool1food, pool1, pool1food);
		}
		while (pool2food.length < 3) {
			generateFood(pool2food, pool2, pool2food);
		}

		loop();
	});

	loader.start();
});