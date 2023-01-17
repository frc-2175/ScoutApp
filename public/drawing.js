function preload() {
	img = loadImage("https://firebasestorage.googleapis.com/v0/b/scout-b39c0.appspot.com/o/2022LayoutMarkingDiagram.png?alt=media&token=71790961-c071-48ea-9a80-e9cc11cb1aa0");
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
