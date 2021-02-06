// make the channels for each sine wave
const channelRight = new Tone.PanVol(0, -12).toDestination();
const channelLeft = new Tone.PanVol(0, -12).toDestination();

// make two oscillators
const rightOsc = new Tone.Oscillator({
	type: "sine",
}).connect(channelRight);

const leftOsc = new Tone.Oscillator({
	type: "sine",
}).connect(channelLeft);

// the frequency signal
const frequency = new Tone.Signal(0.5);

// the move the 0 to 1 value into frequency range
const scale = new Tone.ScaleExp(440, 880);

// multiply the frequency by 2.5 to get a 10th above
const mult = new Tone.Multiply(1);

// chain the components together
frequency.chain(scale, mult);
scale.connect(leftOsc.frequency);
mult.connect(rightOsc.frequency);	

// start the oscillators with the play button
document.querySelector("tone-play-toggle").addEventListener("start", () => {
	rightOsc.start();
	leftOsc.start();
});
document.querySelector("tone-play-toggle").addEventListener("stop", () => {
	rightOsc.stop();
	leftOsc.stop();
});

// ramp the frequency with the slider
document.getElementById("volume").addEventListener("input", e => {
	channelLeft.set({
		volume: parseFloat(e.target.value),
	});
	channelRight.set({
		volume: parseFloat(e.target.value),
	});
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
	channelLeft.set({
		pan: parseFloat(-e.target.value),
	});
	channelRight.set({
		pan: parseFloat(e.target.value),
	});
});