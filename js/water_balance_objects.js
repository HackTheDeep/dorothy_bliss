// Crab
function Crab() {
	this.x = 0;
	this.y = 0;
	this.salinity = 70;
	this.salinityTimer = 10;
}

Crab.prototype.update = function() {
	this.salinityTimer--;
	if (this.salinityTimer <= 0) {
		this.salinity--;
		this.salinityTimer = 10;
	}
};

Crab.prototype.draw = function(ctx, images) {
	var crabImage = images.crab;

	if (this.salinity > 40) {
		crabImage = images.crab_bulging1;
	} else if (this.salinity > 50) {
		crabImage = images.crab_bulging2;
	}

	ctx.drawImage(crabImage, this.x, this.y, 125, 94);
};

// EvilCrab
EvilCrab.prototype = new Crab();
EvilCrab.prototype.constructor = EvilCrab;

function EvilCrab() {
	Crab.call(this);
}

EvilCrab.prototype.update = function() {
	//console.log("wowowow i am evil");
};

// Pool
function Pool() {
	this.x = this.y = 0;
	this.a = this.b = 0;
}

Pool.prototype.update = function() {

};

Pool.prototype.draw = function(ctx, images) {
	ctx.beginPath();
	ctx.fillStyle = "rgba(163, 205, 202, 0.7)";
	ctx.ellipse(this.x, this.y, this.a, this.b, 0, 0, 2 * Math.PI);
	ctx.fill();
};