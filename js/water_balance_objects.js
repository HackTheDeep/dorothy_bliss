// Crab
function Crab() {
	this.x = 0;
	this.y = 0;
	this.inPool = false;
	this.salinity = 15;
	this.salinityTimer = 60;
	this.salinityGenerateTimer = 40;
	this.food = 75;
	this.foodTimer = 20;
	this.width = 125;
	this.height = 94;
	this.speed = 2;
}

Crab.prototype.intersectsWithFood = function(food) {
	var x = this.x + (this.width / 2);
	var y = this.y + (this.height / 2);
	
	if (x > food.x && x < (food.x + food.width) && y > food.y && y < (food.y + food.height)) {
		return true;
	}
	return false;
};

Crab.prototype.intersectsWithPool = function(pool) {
	// from https://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
	var x = this.x + (this.width / 2);
	var y = this.y + (this.height / 2);
	var inequality = (Math.pow(x - pool.x, 2) / Math.pow(pool.a, 2)) + (Math.pow(y - pool.y, 2) / Math.pow(pool.b, 2));
	return (inequality <= 1);
};

Crab.prototype.update = function(scene) {
	this.inPool = false;

	var testPool = function(pool) {
		if (this.intersectsWithPool(pool)) {
			this.salinityGenerateTimer--;
			if (this.salinityGenerateTimer < 0) {
				this.salinityGenerateTimer = 40;
				this.salinity += 1;
				if (this.salinity > 35) {
					die();
				}
			}
			this.inPool = true;
		}
	};

	testPool.call(this, scene.pool1);
	testPool.call(this, scene.pool2);

	if (!this.inPool) {
		this.salinityTimer--;
		if (this.salinityTimer <= 0) {
			this.salinity--;
			this.salinityTimer = 60;
		}
		if (this.salinity <= 0) {
			die();
		}
	}

	this.foodTimer--;
	if (this.foodTimer <= 0) {
		this.food--;
		this.foodTimer = 20;
		if (this.food <= 0) {
			die();
		}
	}
};

Crab.prototype.draw = function(ctx, images) {
	var crabImage = images.crab;

	if (this.salinity > 15) {
		crabImage = images.crab_bulging1;
	} else if (this.salinity > 20) {
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
}

EvilCrab.prototype.update = function(scene) {
	// target select
	if (this.targetPool == -1) {
		// find food to eat
		this.targetPool = Math.floor((Math.random() * 2) + 1);
		var targetPoolFood = (this.targetPool == 1 ? scene.pool1food : scene.pool2food);
		this.targetFoodIndex = Math.floor((Math.random() * targetPoolFood.length));
	}

	var targetPoolObject = (this.targetPool == 1 ? scene.pool1 : scene.pool2);
	var targetPoolFood = (this.targetPool == 1 ? scene.pool1food : scene.pool2food);
	var targetFood = targetPoolFood[this.targetFoodIndex];

	if (!targetFood) {
		this.targetPool = -1;
		return;
	}

	var foodCenterX = targetFood.x + (targetFood.width / 2);
	var foodCenterY = targetFood.y + (targetFood.height / 2);
	var crabCenterX = this.x + (this.width / 2);
	var crabCenterY = this.y + (this.height / 2);

	// target eat
	if (Math.abs(foodCenterX - crabCenterX) < 3 && Math.abs(foodCenterY - crabCenterY) < 3) {
		if (this.eatTimer > 1*60) {
			// eat food
			targetFood.eat(this);
			targetPoolFood.splice(this.targetFoodIndex, 1);

			// burrow
			this.x = Math.floor((Math.random() * (800 - 200)) + 1);
			this.y = 250 + Math.floor((Math.random() * (600 - 250 - 100)) + 1);

			// reset
			this.eatTimer = 0;
			this.targetPool = -1;
			this.targetFoodIndex = -1;
		} else {
			this.eatTimer++;
		}
	} else {
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

Food.prototype.eat = function(crab) {
	crab.food += 10;
	crab.food = Math.min(100, crab.food);
};

Food.prototype.update = function() {

};

Food.prototype.draw = function(ctx, images) {
	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	// ctx.beginPath();
	// ctx.fillStyle = "black"; //rgba(163, 205, 202, 0.7)";
	// ctx.ellipse(this.x, this.y, 3, 3, 0, 0, 2 * Math.PI);
	// ctx.fill();
};