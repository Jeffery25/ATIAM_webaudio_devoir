function makeChannel(name, url, pan) {
	const channel = new Tone.Channel({
		pan
	}).toDestination();
	const player = new Tone.Player({
		url: `https://tonejs.github.io/audio/berklee/${url}.mp3`,
		loop: true
	}).sync().start(0);
	player.connect(channel);

	// add a UI element
	ui({
		name,
		tone: channel,
		parent: document.querySelector("#content")
	});
}
			
// create a meter on the destination node
const toneMeter = new Tone.Meter({ channels: 2 });
Tone.Destination.chain(toneMeter);
meter({
	tone: toneMeter,
	parent: document.querySelector("#content")
});

makeChannel("Guitar 0", "comping1", 1);
makeChannel("Guitar 1", "comping2", -1);
makeChannel("Guitar 2", "comping3", 0.25);
makeChannel("Guitar 3", "comping4", -0.25);

document.querySelector("tone-play-toggle").addEventListener("start", () => Tone.Transport.start());
document.querySelector("tone-play-toggle").addEventListener("stop", () => Tone.Transport.stop());
