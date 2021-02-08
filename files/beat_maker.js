//////////////////////////
// Create the waveform
//////////////////////////

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
const frequency = new Tone.Signal(0.1);
const scale = new Tone.ScaleExp(20, 8000);
const mult = new Tone.Multiply(1);

// chain the components together
frequency.chain(scale, mult);
scale.connect(leftOsc.frequency);
mult.connect(rightOsc.frequency);


//////////////////////////
// Draw the waveform
//////////////////////////

// define drawing of the canvas
function canvasMaker() {
	const width = document.getElementById("oscilloscope").offsetWidth
	var canvas = createCanvas(width, width / 3);
	canvas.parent('oscilloscope')
}

// setup for p5.js library
function setup () {

	// draw the canvas
	canvasMaker()

	// set the grey background
	background('#1e1f24');

	// create an analyser node that makes a waveform
	analyser = new Tone.Analyser('waveform', 1024);

	// Connect with analyser as well so we can detect waveform
	Tone.Master.connect(analyser);

	// lower frame rate so the oscilloscope is viewable
	frameRate(30);
}

// On window resize, update the canvas size
function windowResized () {
	canvasMaker()
}

// Render loop that draws shapes with p5
function draw() {
  
	const dim = Math.min(width, height);
	const values = analyser.getValue();
	
	background('#1e1f24');

	strokeWeight(dim * 0.0025);
	stroke('#f4f4f4');
	noFill();
	beginShape();
	for (let i = 0; i < values.length; i++) {
	  const amplitude = values[i];
	  const x = map(i, 0, values.length - 1, 0, width);
	  const y = height / 2 + amplitude * height;
	  vertex(x, y);
	}
	endShape();
}


//////////////////////////
// React to the controls
//////////////////////////

// play button
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

// volume control
document.getElementById("volume").addEventListener("input", e => {
	newVolume = 20 * parseFloat(e.target.value) - 30
	Tone.Master.volume.value = newVolume;
});

// pitch control
document.getElementById("pitch-all").addEventListener("input", e => {
	frequency.rampTo(parseFloat(e.target.value), 0.1);
});

// split the pitches
document.getElementById("pitch").addEventListener("input", e => {
	mult.rampTo(parseFloat(e.target.value), 0.1);
});

// split the panning
document.getElementById("space").addEventListener("input", e => {
	channelLeft.pan.value = parseFloat(-e.target.value);
	channelRight.pan.value = parseFloat(e.target.value);
});
