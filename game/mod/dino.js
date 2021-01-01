import Entity from "./entity.js";
import { ground } from "./constants.js"

export const DINO = {
	running: "running",
	jumping: "jumping",
	dead: "dead",
	idle: "idle",
	ducking: "ducking",
	duckjumping: "duckjump"
}

export default class Dino extends Entity {

	static animationCycle = 0.1;
	static jumpStrength = 1000;
	static gravity = 3000;
	static duckMultiplier = 4;

	constructor(x, y) {
		super(x, y, 88, 94);
		this.state = null;
		this.ySpeed = 0;
		this.animationTime = 0;
		this.setState(DINO.idle);
	}

	// Set state
	setState(newState) {

		console.log("SWITCH\t" + this.state + "\t" + newState);

		if (this.state === DINO.jumping && newState === DINO.running) {
			console.log("AFRES");
		}

		// Check validity, adjust sprite
		if (this.state !== DINO.jumping && newState === this.state) return;
		if (this.state === DINO.dead) return;
		switch (newState) {
			case DINO.running:
				if (this.y == ground) break;
				else if (this.state !== DINO.duckjumping) return;
				else newState = DINO.jumping;

				case DINO.jumping:
				if (this.state === DINO.ducking) return;
				if (this.y <= ground * 2) this.ySpeed = Dino.jumpStrength;
				this.setSprite(1338, 2);
				break;
			case DINO.ducking:
				if (this.state === DINO.jumping) newState = DINO.duckjumping;
				this.setSprite(1866, 36);
				break;
			case DINO.dead:
				this.setSprite(1690, 2);
				break;
			case DINO.idle:
				this.setSprite(1338, 2);
		}

		// Adjust hitboxes
		if (newState === DINO.ducking || newState === DINO.duckjumping) {
			this.width = 118;
			this.height = 60;
			this.hitbox.x = 0;
			this.hitbox.y = 0;
			this.hitbox.width = 118;
			this.hitbox.height = 58;
		} else {
			this.width = 88;
			this.height = 94;
			this.hitbox.x = 20;
			this.hitbox.y = 0;
			this.hitbox.width = 44;
			this.hitbox.height = 94;
		}

		// Update state
		this.state = newState;
		console.log("SET\t\t" + this.state);
		this.render();
	}

	// Override: Update position, animation, state
	update(delta, round) {

		// Animate
		this.animationTime += delta;
		if (this.animationTime > Dino.animationCycle * 2) {
			this.animationTime = 0;
		}
		if (this.state === DINO.running) {
			this.setSprite(this.animationTime > Dino.animationCycle ? 1514 : 1602, 2);
		} else if (this.state === DINO.ducking) {
			this.setSprite(this.animationTime > Dino.animationCycle ? 1984 : 1866, 36);
		}

		// Fall
		if (this.state === DINO.jumping || this.state === DINO.duckjumping) {
			this.move(0, this.ySpeed * delta)
			this.ySpeed -= (this.state === DINO.jumping ? Dino.gravity : Dino.gravity * Dino.duckMultiplier) * delta;
			if (this.ySpeed < 0 && this.y < ground) {
				this.y = ground;
				this.setState(this.state === DINO.jumping ? DINO.running : DINO.ducking);
			}
		}

		// Rerender
		this.render();
	}
}