import Entity from "./entity.js";
import { ground, sky } from "./constants.js";
import {randomIntRange} from "./util.js";

export default class Bird extends Entity {

	static animationCycle = 0.5;

	constructor(x) {
		super();
		this.speed = randomIntRange(10, 20);
		this.animationTime = Bird.animationCycle * 2 * Math.random();

		// Sprite
		this.height = 80;
		this.width = 92;
		this.x = x;
		this.y = randomIntRange(ground, sky - this.height);

		// Hitbox
		this.hitbox.height = 32;
		this.hitbox.width = 84;
		this.hitbox.x = 4;
		this.hitbox.y = 24;
	}

	// Override: Account for entity speed and animation
	update(delta, round) {

		// Move
		this.move(-delta * this.speed, 0);

		// Animate
		this.animationTime += delta;
		if (this.animationTime > Bird.animationCycle * 2) {
			this.animationTime = 0;
		}
		this.setSprite(this.animationTime > Bird.animationCycle ? 260 : 260 + this.width, 2);

		super.update(delta, round);
	}
}