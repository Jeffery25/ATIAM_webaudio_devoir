
// use this to pan the two oscillators hard left/right
const merge = new Tone.Merge().toDestination();

// two oscillators panned hard left / hard right
const rightOsc = new Tone.Oscillator({
	type: "sawtooth",
	volume: -20
}).connect(merge, 0, 0);

const leftOsc = new Tone.Oscillator({
	type: "square",
	volume: -20
}).connect(merge, 0, 1);

// create an oscillation that goes from 0 to 1200
// connection it to the detune of the two oscillators
const detuneLFO = new Tone.LFO({
	type: "square",
	min: 0,
	max: 1200
}).fan(rightOsc.detune, leftOsc.detune).start();

// the frequency signal
const frequency = new Tone.Signal(0.5);

// the move the 0 to 1 value into frequency range
const scale = new Tone.ScaleExp(110, 440);

// multiply the frequency by 2.5 to get a 10th above
const mult = new Tone.Multiply(2.5);

// chain the components together
frequency.chain(scale, mult);
scale.connect(rightOsc.frequency);
mult.connect(leftOsc.frequency);

// multiply the frequency by 2 to get the octave above
const detuneScale = new Tone.Scale(14, 4);
frequency.chain(detuneScale, detuneLFO.frequency);		

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
document.querySelector("tone-slider").addEventListener("input", e => {
	frequency.rampTo(parseFloat(e.target.value), 0.1);
});

