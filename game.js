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

	actorAt(actor) {
		if (!(actor instanceof Actor) || actor === undefined) {
			throw new Error('Передан неверный аргумент, либо аргумент отсутствует.');
		}

		if (this.actors) {
			for (let item of this.actors) {
				if (item) {
					if (actor.isIntersect(item)) {
						return item;
					}
				}
			}
		}
	}

	obstacleAt(nextPos, vecSize) {
		if (!(nextPos instanceof Vector) && !(vecSize instanceof Vector)) {
			throw new Error('Передан неверный аргумент.');
		}

		let space = new Actor(nextPos, vecSize);

		if (this.actors) {
			for (let item of this.actors) {
				if (item) {
					if (space.isIntersect(item)) {
						return space.type;
					}
				}
			}
		}

		for (let y = nextPos.y; y <= nextPos.y + vecSize.y; y++) {
			for (let x = nextPos.x; x <= nextPos.x + vecSize.x; x++) {
				console.log(grid[y][x]);
			}
		}

		if ((nextPos.y + vecSize.y) > this.height) { return 'lava' };

		if (nextPos.y < 0 || nextPos.x < 0 || (nextPos.x + vecSize.x) > this.width) { return 'wall' };

		return undefined;
	}

	removeActor(actor) {
		let index;
		for (let i = 0; i < this.actors.length; i++) {
			if (this.actors[i] === actor) {
				index = i;
				break;
			}
		}
		this.actors[index] = undefined;
	}

	noMoreActors(actorType) {
		let result = true;

		if (this.actors) {
			this.actors.forEach(item => {
				if (item) {
					if (item.type === actorType) {
						result = false;
					}
				}
			});
		}

		return result;
	}

	playerTouched(barrier, actor) {
		if (this.status === null) {
			if (barrier === 'lava' || barrier === 'fireball') {
				this.status = 'lost';
			}

			if (barrier === 'coin') {
				this.removeActor(actor);
				if (this.noMoreActors(barrier)) {
					this.status = 'won';
				}
			}
		}
	}
}





const grid = [
  [undefined, undefined],
  ['wall', 'wall']
];

function MyCoin(title) {
  this.type = 'coin';
  this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
  console.log('Все монеты собраны');
  console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
  console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
  console.log('Пользователь столкнулся с шаровой молнией');
}