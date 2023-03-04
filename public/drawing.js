function disableTouchScroll() {
	const canvasDom = document.getElementById("defaultCanvas0");
	canvasDom.addEventListener("touchstart", (event) => { event.preventDefault(); });
	canvasDom.addEventListener("touchmove", (event) => { event.preventDefault(); });
	canvasDom.addEventListener("touchend", (event) => { event.preventDefault(); });
	canvasDom.addEventListener("touchcancel", (event) => { event.preventDefault(); });
}

function preload() {
	img = loadImage("https://firebasestorage.googleapis.com/v0/b/scout-b39c0.appspot.com/o/2023-field-color-reduced.png?alt=media&token=8a177faf-bb7b-4382-86b9-e61e5be0dc34");
}

function setup() {
	const canvas = createCanvas(displayWidth * 0.95, displayWidth * 0.95 * 0.56);
	canvas.parent("autoPath");
	noFill();
	strokeWeight(3);
	background(img);
	disableTouchScroll();
}

function reset() {
	const parentElement = document.getElementById("autoPathParent");
	parentElement.removeChild(parentElement.children[0]);
	let autoPathElement = document.createElement("div");
	autoPathElement.id = "autoPath";
	parentElement.appendChild(autoPathElement);
	setup();
}

function windowResized() {
	resizeCanvas(windowWidth * 0.95, windowWidth * 0.95 * 0.56);
	background(img);
}

function touchStarted() {
	beginShape();
}

function touchMoved() {
	curveVertex(mouseX, mouseY);
	endShape();
}
