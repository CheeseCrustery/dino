import Entity from "./entity.js";
import {ground} from "./constants.js";
import {randomIntRange} from "./util.js";

export default class Ground extends Entity {

    constructor(x) {
        super(x, ground / 2, 601, 26);
        this.setSprite(randomIntRange(0, 4) * 601, 130-26);
    }
}