import Box from "./box.js";

const showHitbox = false;
const showSpritebox = false;
export default class Entity extends Box {

	constructor (x, y, width, height) {
		super(x, y, width, height);
		this.hitbox = new Box(0, 0, width, height); // Coords relative to spritebox
		this.ref = document.createElement("div");
		this.ref.classList.add("entity");

		if (showHitbox) {
			this.hitboxref = document.createElement("div");
			this.hitboxref.classList.add("hitbox");
			this.ref.appendChild(this.hitboxref);
		}

		if (showSpritebox) {
			this.ref.classList.add("spritebox");
		}
	}

	// Update every render
	update(delta, round) {
		this.move(-delta * round.speed(), 0);
		this.render();
	}

	// Update the entity's DOM properties
	render() {
		this.ref.style.bottom = this.y + "px";
		this.ref.style.left = this.x + "px";
		this.ref.style.width = this.width + "px";
		this.ref.style.height = this.height + "px";

		if (showHitbox) {
			this.hitboxref.style.bottom = this.hitbox.y + "px";
			this.hitboxref.style.left = this.hitbox.x + "px";
			this.hitboxref.style.width = this.hitbox.width + "px";
			this.hitboxref.style.height = this.hitbox.height + "px";
		}
	}

	// Return whether the entities' hitboxes collide
	hits(other) {
		let thisBox = this.hitbox.relativeTo(this);
		let otherBox = other.hitbox.relativeTo(other);
		return thisBox.intersectsBox(otherBox);
	}

	// Set the upper left corner of the spritesheet
	setSprite(x, y) {
		this.ref.style.backgroundPosition = (-x) + "px " + (-y) + "px"
	}
}