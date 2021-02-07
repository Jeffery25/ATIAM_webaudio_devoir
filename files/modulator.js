// panners for seperating our 2 oscillators
const channelRight = new Tone.PanVol().toDestination();
const channelLeft = new Tone.PanVol().toDestination();
Tone.Master.volume.value = -20;

// make two oscillators
var rightOsc = new Tone.Oscillator({
	type: "sine",
}).connect(channelRight);

var leftOsc = new Tone.Oscillator({
	type: "sine",
}).connect(channelLeft);

// the frequency signal
const frequency = new Tone.Signal(0.5);
const scale = new Tone.ScaleExp(440, 880);
const mult = new Tone.Multiply(1);

// chain the components together
frequency.chain(scale, mult);
scale.connect(leftOsc.frequency);
mult.connect(rightOsc.frequency);

// Create a new canvas to the browser size
function setup () {
	
	var canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('oscilloscope')
	// Clear with black on setup
	background(0);

	// Create an analyser node that makes a waveform
	analyser = new Tone.Analyser('waveform', 1024);

	// Connect with analyser as well so we can detect waveform
	Tone.Master.connect(analyser);

	// define frame so the oscilloscope is understandable
	frameRate(30);
}

// On window resize, update the canvas size
function windowResized () {
	resizeCanvas(windowWidth, windowHeight);
}

// Render loop that draws shapes with p5
function draw() {
  
	const dim = Math.min(width, height);
	const values = analyser.getValue();
	
	//if (abs(values[0]) < 0.1 && values[0] <= values[1]) {
		// White background
		background('#fff');

		strokeWeight(dim * 0.0025);
		stroke(0);
		noFill();
		beginShape();
		for (let i = 0; i < values.length; i++) {
		  const amplitude = values[i];
		  const x = map(i, 0, values.length - 1, 0, width);
		  const y = height / 2 + amplitude * height;
		  // Place vertex
		  vertex(x, y);
		}
		endShape();
	//}
}


// Interactive
document.getElementById("player").addEventListener("click", updatePlayer);
function updatePlayer() {
    if (player.textContent === "Play") {
        player.textContent = "Stop";
        rightOsc.start();
		leftOsc.start();
    } else {
        player.textContent = "Play"
        rightOsc.stop();
		leftOsc.stop();
    }
}


// ramp the frequency with the slider
document.getElementById("volume").addEventListener("input", e => {
	Tone.Master.volume.value = parseFloat(e.target.value);
});


// ramp the frequency with the slider
document.getElementById("pitch-all").addEventListener("input", e => {
	frequency.rampTo(parseFloat(e.target.value), 0.1);
});
// ramp the frequency with the slider
document.getElementById("pitch").addEventListener("input", e => {
	mult.rampTo(parseFloat(e.target.value), 0.1);
});


document.getElementById("space").addEventListener("input", e => {
	channelLeft.pan.value = parseFloat(-e.target.value);
	channelRight.pan.value = parseFloat(e.target.value);
});
