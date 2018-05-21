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

	isIntersect(actor) {
		if (!(actor instanceof Actor) || (actor === undefined)) {
			throw new Error('Неверный аргумент функции.'); 
		}

		if (actor === this) return false;

		if (this.left >= actor.right || this.top >= actor.bottom || this.right <= actor.left || this.bottom <= actor.top) {
			return false;
		} else {
			return true;
		}
	}
}

class Level {
	constructor(grid, actors) {
		this.grid = grid;
		this.actors = actors;
		this.status = null;
		this.finishDelay = 1;
	}

	get height() {
		return this.grid ? this.grid.length : 0;
	}

	get width() {
		if (this.grid === undefined) {
			return 0;
		}

		let width = 0;
		this.grid.forEach(string => {
			if (string.length > width) {
				width = string.length;
			}
		});

		return width;
	}

	get player() {
		let player;
		this.actors.forEach(act => {
			if (act.type === 'player') {
				player = act;
			}
		});

		return player;
	}

	isFinished() {
		if (this.status !== null && this.finishDelay < 0) {
			return true;
		}

		return false;
	}
}

const grid = [
	new Array(3),
	['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);