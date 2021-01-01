import Bird from "./mod/bird.js";
import Dino, { DINO } from "./mod/dino.js";
import Cactus from "./mod/cactus.js";
import { randomIntRange } from "./mod/util.js";
import Entity from "./mod/entity.js";
import {finalGameHeight, finalGameWidth, ground, padding, sky} from "./mod/constants.js";
import Ground from "./mod/ground.js";
import Box from "./mod/box.js";
import Round from "./mod/round.js";

// Game state enum
const STATE = {
	start: 0,
	starting: 1,
	ingame: 2,
	end: 3
}

// UI elements
const gameOver = initGameOver();
const noInternet = document.createElement("div");
noInternet.id = "nointernet";
noInternet.innerHTML = "<h1>No Internet!</h1>\n" +
	"<p>Try:</p>\n" +
	"<ul>\n" +
	"    <li>Alerting the Veit Sauer tech support hotline</li>\n" +
	"    <li>Connecting to https://bit.ly/3rDrldj to resolve the issue</li>\n" +
	"</ul>\n" +
	"<p>ERR_INTERNET_DISCONNECTED</p>";
const video = document.createElement("a");
video.id = "video";
video.href = "https://xhamster.com/videos/public-anal-gefickt-fuer-sperma-doener-kebab-6932707";
video.text = "Hmm, let's go for something else ( ͡° ͜ʖ ͡°)"

// Game window
const gameWindow = new Entity((window.innerWidth - finalGameWidth) / 2, window.innerHeight - finalGameHeight - 100, 88 + 2 * padding, finalGameHeight);
gameWindow.hitbox = new Box(0,0,0,0);
gameWindow.ref.id = "game";
document.getElementsByTagName('body')[0].appendChild(gameWindow.ref);
gameWindow.ref.classList.remove("entity");
resize();
gameWindow.render();

// Score display
const scoreDiv = document.createElement("div");
scoreDiv.id = "score";
scoreDiv.style.width = 60 + "px";
scoreDiv.style.top = padding + "px";
scoreDiv.style.left = (finalGameWidth - 100 - padding) + "px";
gameWindow.ref.appendChild(scoreDiv);

// Declarations
var state, round;
var groundTiles = [new Ground(0)];
gameWindow.ref.appendChild(groundTiles[0].ref);
groundTiles[0].render();
setState(STATE.start);

// Resize the UI elements
function resize() {
	gameWindow.x = (window.innerWidth - finalGameWidth) / 2;
	gameWindow.y = window.innerHeight * 2 / 3 - finalGameHeight / 2;
	gameWindow.render();

	noInternet.style.top = (window.innerHeight - gameWindow.y + 10) + "px";
	noInternet.style.left = gameWindow.x + "px";
	noInternet.style.width = finalGameWidth + "px";

	video.style.top = (window.innerHeight - gameWindow.y + 10) + "px";
	video.style.left = gameWindow.x + "px";
	video.style.width = finalGameWidth + "px";
}

// Initialize the game over screen
function initGameOver() {

	// Centered div
	let screen = document.createElement("div");
	screen.classList.add("center");

	// Restart button
	let button = document.createElement("button");
	button.id = "restart";
	button.onclick = () => { setState(STATE.ingame) };

	// "Game over!"
	let text = document.createElement("p");
	text.textContent = "Game Over!";
	text.id = "gameover";

	// Return screen;
	screen.appendChild(text);
	screen.appendChild(button);
	return screen;
}

// Set game state
function setState(newState) {
	if (newState === state) return;

	switch (newState) {
		case STATE.start:
			document.getElementsByTagName("body")[0].appendChild(noInternet);
			round = new Round();
			gameWindow.ref.appendChild(round.dino.ref);
			round.dino.render();
			break;
		case STATE.starting:
			document.getElementsByTagName("body")[0].removeChild(noInternet);
			break;
		case STATE.end:
			round.dino.setState(DINO.dead);
			gameWindow.ref.appendChild(gameOver);
			if (round.score >= 900) {
				document.getElementsByTagName("body")[0].appendChild(video);
			}
			break;
		case STATE.ingame:
			if (state === STATE.end) {
				let remove = (e) => { gameWindow.ref.removeChild(e.ref) };
				round.birds.forEach(remove);
				round.cacti.forEach(remove);
				remove(round.dino);
				gameWindow.ref.removeChild(gameOver);
				round = new Round();
			}
			gameWindow.ref.appendChild(round.dino.ref);
			round.dino.setState(DINO.running);
			round.dino.render();
	}
	state = newState;
}

// Game loop
var oldTime = 0;
function loop(newTime) {
	let delta = newTime - oldTime;
	switch (state) {
		case STATE.starting:
			startingAnimation(delta);
			break;
		case STATE.ingame:
			ingameLoop(delta);
	}
	oldTime = newTime;
	window.requestAnimationFrame(loop);
}

// Detect collisions, remove and update entities
function updateEntities(delta, arr, collision) {
	for (let i = 0; i < arr.length; i++) {
		arr[i].update(delta, round);
		if (collision && arr[i].hits(round.dino)) {
			setState(STATE.end);
		}
		if (arr[i].outOfBounds()) {
			gameWindow.ref.removeChild(arr[i].ref);
			arr.splice(i, 1);
			i--;
		}
	}
}

// Remove entities from DOM
function removeEntities(arr) {
	arr.forEach((e) => gameWindow.ref.removeChild(e.ref));
}

// Spawn ground tiles
function spawnGround() {
	let lastTile = groundTiles[groundTiles.length-1];
	if (lastTile.x < gameWindow.width) {
		let newTile = new Ground(lastTile.x + lastTile.width);
		groundTiles.push(newTile);
		gameWindow.ref.appendChild(newTile.ref);
	}
}

// Do beginning animation and switch over when finished
function startingAnimation(delta) {
	delta /= 1000;

	// Update entities
	round.dino.update(delta, round);
	updateEntities(delta, groundTiles, false);
	spawnGround();
	round.tick(delta);
	scoreDiv.innerText = Math.round(round.score).toString().padStart(4, "0");

	// Game window expansion
	gameWindow.width += (finalGameWidth / 2) * delta;
	gameWindow.render();
	if (gameWindow.width >= finalGameWidth) {
		gameWindow.width = finalGameWidth;
		gameWindow.render();
		setState(STATE.ingame);
	}
}

// Do game movements
function ingameLoop(delta) {
	delta /= 1000;

	// Update entities
	round.dino.update(delta, round);
	updateEntities(delta, round.birds, true);
	updateEntities(delta, round.cacti, true);
	updateEntities(delta, groundTiles, false);
	spawnGround();
	scoreDiv.innerText = Math.round(round.score).toString().padStart(4, "0");

	// Spawn new obstacles
	round.nextSpawn -= round.speed() * delta;
	if (round.nextSpawn <= 0) {
		let newObj;
		if (Math.random() < Math.min(round.score / 1200, 0.4)) {
			newObj = new Bird(gameWindow.width);
			round.birds.push(newObj);
		} else {
			newObj = new Cactus(randomIntRange(0, 2), gameWindow.width);
			round.cacti.push(newObj);
		}
		round.nextSpawn = newObj.width + 4 * round.dino.width + Math.random() * (gameWindow.width - 4 * round.dino.width);
		gameWindow.ref.appendChild(newObj.ref);
	}

	// Update time
	round.tick(delta);
}

// Handle input
document.addEventListener("keydown", (event) => {
	if (event.code == "Space") {
		round.dino.setState(DINO.jumping);
		if (state === STATE.start) {
			setState(STATE.starting);
		}
	} else if (event.code === "ArrowDown") {
		round.dino.setState(DINO.ducking);
	}
});
document.addEventListener("keyup", (event) => {
	if (event.code == "ArrowDown") {
		round.dino.setState(DINO.running);
	}
})

// Handle resize
window.onresize = resize;

// Start game loop
window.requestAnimationFrame(loop);

