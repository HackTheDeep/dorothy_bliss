var loader = new PxLoader();

var imageList = [
	"sand",
	"crab"
];

var images = {};

var canvas;
var ctx;

var crabX = 0;
var crabY = 0;

var loop = function() {
	ctx.drawImage(images.sand, 0, 0);
	ctx.drawImage(images.crab, crabX, crabY, 100, 75);

	window.requestAnimationFrame(loop);
};

var keychange = function(down, e) {
	var code = e.keyCode;
	switch (code) {
		case 37: console.log("Left"); break;
		case 38: console.log("Up"); break;
		case 39: console.log("Right"); break;
		case 40: console.log("Down"); break;
		default: console.log(code);
    }
};

$(document).ready(function() {
	imageList.forEach(function(imageName) {
		images[imageName] = loader.addImage("img/water_balance/" + imageName + ".png");
	});

	loader.addCompletionListener(function() {
		canvas = document.querySelector("canvas");
		ctx = canvas.getContext("2d");

		window.addEventListener("keydown", this.keychange.bind(true), false);
		window.addEventListener("keyup", this.keychange.bind(false), false);

		loop();
	});

	loader.start();
});