import Entity from "./entity.js";
import { randomIntRange } from "./util.js";
import { ground } from "./constants.js";

export default class Cactus extends Entity {

	constructor(size, x) {
		super();
		this.size = size;

		if (this.size == 0) {

			// Sprite
			this.width = 34;
			this.height = 70;

			// Hitbox
			this.hitbox.x = 10;
			this.hitbox.height = this.height;
			this.hitbox.width = 14;

			// Image
			this.ref.style.backgroundPosition = -(446 + randomIntRange(0, 5) * this.width) + "px -2px";
		} else if (this.size == 1) {

			// Sprite
			this.width = 50;
			this.height = 100;

			// Hitbox
			this.hitbox.x = 16;
			this.hitbox.width = 18;
			this.hitbox.height = this.height;

			// Image
			this.ref.style.backgroundPosition = -(652 + randomIntRange(0, 3) * this.width) + "px -2px";
		} else {

			// Sprite
			this.width = 102;
			this.height = 100;

			// Hitbox
			this.hitbox.x = 12;
			this.hitbox.width = 74;
			this.hitbox.height = this.height;

			// Image
			this.ref.style.backgroundPosition = "-850px -2px";
		}
		this.x = x;
		this.y = ground;
	}
}