'use strict';

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	plus(vector) {
		if (vector instanceof Vector) {
			return new Vector(this.x + vector.x, this.y + vector.y);
		} else {
			throw new Error('Передаваемый в функцию обьект не является вектором.');
		}
	}

	times(multiplier) {
		return new Vector(this.x * multiplier, this.y * multiplier);
	}
}

class Actor {
	constructor(vectorPos = new Vector(0, 0), vectorSize = new Vector(1, 1), vectorSpeed = new Vector(0, 0)) {
		if (vectorPos instanceof Vector && vectorSize instanceof Vector && vectorSpeed instanceof Vector) {
			this.pos = vectorPos;
			this.size = vectorSize;
			this.speed = vectorSpeed;
			this.act = function() {};
		} else {
			throw new Error('Передаваемый в функцию обьект не является вектором.');
		}
	}

	get type() {
		return 'actor';
	}
	get left() {
		return this.pos.x;
	}

	get top() {
		return this.pos.y;
	}

	get right() {
		return this.pos.x + this.size.x;
	}

	get bottom() {
		return this.pos.y + this.size.y;
	}

	isIntersect() {
		
	}
}

class Level {

}

const grid = [
	new Array(3),
	['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);