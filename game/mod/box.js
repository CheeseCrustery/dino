export default class Box {

	constructor (x, y, width, height) {
		this.x = x; // Left
		this.y = y; // Bottom
		this.width = width;
		this.height = height;
	}

	// Move the box
	move(x, y) {
		this.y += y;
		this.x += x;
	}

	// Position this relative to the other box, return new object
	relativeTo(other) {
		return new Box(this.x + other.x, this.y + other.y, this.width, this.height);
	}

	// Return bool indicating whether the box contains the point
	intersectsPoint(x1, y1) {
		let xInt = (x1 < this.x) != (x1 < this.x + this.width);
		let yInt = (y1 < this.y) != (y1 < this.y + this.height);
		return xInt && yInt;
	}

	// Return bool indicating whether the boxes intersect
	intersectsBox(other) {
		return (
			this.intersectsPoint(other.x, other.y)
			|| this.intersectsPoint(other.x, other.y + other.height)
			|| this.intersectsPoint(other.x + other.width, other.y)
			|| this.intersectsPoint(other.x + other.width, other.y + other.height)
			|| other.intersectsPoint(this.x, this.y)
			|| other.intersectsPoint(this.x, this.y + this.height)
			|| other.intersectsPoint(this.x + this.width, this.y)
			|| other.intersectsPoint(this.x + this.width, this.y + this.height)
		)
	}

	// Return whether the box is not visible on screen anymore
	outOfBounds() {
		return this.x + this.width < 0;
	}
}