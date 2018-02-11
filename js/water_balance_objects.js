// Crab
function Crab() {
	this.x = 0;
	this.y = 0;
	this.salinity = 70;
	this.salinityTimer = 30;
	this.width = 125;
	this.height = 94;
}

Crab.prototype.update = function() {
	this.salinityTimer--;
	if (this.salinityTimer <= 0) {
		this.salinity--;
		this.salinityTimer = 30;
	}
};

Crab.prototype.draw = function(ctx, images) {
	var crabImage = images.crab;

	if (this.salinity > 40) {
		crabImage = images.crab_bulging1;
	} else if (this.salinity > 50) {
		crabImage = images.crab_bulging2;
	}
	
	if (this.evil) {
		crabImage = images.crab_evil;
	}

	ctx.drawImage(crabImage, this.x, this.y, this.width, this.height);
};

// EvilCrab
EvilCrab.prototype = new Crab();
EvilCrab.prototype.constructor = EvilCrab;

function EvilCrab(goodCrab) {
	Crab.call(this);
	this.evil = true;
	this.goodCrab = goodCrab;
	this.targetPool = -1;
	this.targetFoodIndex = -1;
	this.eatTimer = 0;
	this.speed = 1;
}

EvilCrab.prototype.update = function(scene) {
	// target select
	if (this.targetPool == -1) {
		// find food to eat
		this.targetPool = Math.floor((Math.random() * 2) + 1);
		this.targetFoodIndex = Math.floor((Math.random() * 3));
	}

	var targetPoolObject = (this.targetPool == 1 ? scene.pool1 : scene.pool2);
	var targetPoolFood = (this.targetPool == 1 ? scene.pool1food : scene.pool2food);
	var targetFood = targetPoolFood[this.targetFoodIndex];

	var foodCenterX = targetFood.x + (targetFood.width / 2);
	var foodCenterY = targetFood.y + (targetFood.height / 2);
	var crabCenterX = this.x + (this.width / 2);
	var crabCenterY = this.y + (this.height / 2);

	// target movement
	if (foodCenterX > crabCenterX) {
		this.x += this.speed;
	} else if (foodCenterX < crabCenterX) {
		this.x -= this.speed;
	}

	if (foodCenterY > crabCenterY) {
		this.y += this.speed;
	} else if (foodCenterY < crabCenterY) {
		this.y -= this.speed;
	}

	// target eat
	if (Math.abs(foodCenterX - crabCenterX) < 3 && Math.abs(foodCenterY - crabCenterY) < 3) {
		if (this.eatTimer > 3*60) {

		} else {
			this.eatTimer++;
		}
	}
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

// Food
function Food() {
	this.x = this.y = 0;
	this.image = (Math.random() > 0.5 ? images.grass1 : images.grass2);
	this.origWidth = (this.image == images.grass1 ? 562 : 971);
	this.origHeight = (this.image == images.grass1 ? 1020 : 2051);
	this.width = 35;
	this.height = this.origHeight * (this.width/this.origWidth);
}

Food.prototype.update = function() {

};

Food.prototype.draw = function(ctx, images) {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	// ctx.beginPath();
	// ctx.fillStyle = "black"; //rgba(163, 205, 202, 0.7)";
	// ctx.ellipse(this.x, this.y, 3, 3, 0, 0, 2 * Math.PI);
	// ctx.fill();
};