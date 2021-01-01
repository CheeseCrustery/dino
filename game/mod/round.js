import Dino from "./dino.js";
import { ground, padding } from "./constants.js";

export default class Round {

    constructor() {
        this.nextSpawn = 0;
        this.score = 0;
        this.timeSinceStart = 0;
        this.birds = [];
        this.cacti = [];
        this.dino = new Dino(padding, ground);
    }

    // Progress time and score
    tick(delta) {
        this.timeSinceStart += delta;
        this.score += this.speed() * delta / 100;
    }

    // Calculate the speed of entities
    speed() {
        return 200 + 100 * Math.log(Math.E + this.timeSinceStart);
    }
}