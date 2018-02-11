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

var crab = new Crab();
crab.x = crab.y = 300;
objects.push(crab);

var evilCrab = new EvilCrab();
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

var loop = function() {
	// update
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
	objects.forEach(function(object) {
		object.update();
	});

	// draw
	ctx.drawImage(images.sand, 0, 0);
	objects.forEach(function(object) {
		object.draw(ctx, images);
	});
	ctx.fillStyle = "black";
	ctx.font = "14px Arial";
	ctx.fillText("Salinity: " + crab.salinity + "%", 10, 24); 

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

		loop();
	});

	loader.start();
});