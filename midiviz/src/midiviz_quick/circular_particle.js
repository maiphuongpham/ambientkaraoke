import CircularParticleSet from "../collections/CircularParticleSet.js";
import NotePlayer from "../midi_player/NotePlayer.js";
//a midi visualizer with Particle and NotePlayer class
new p5(function (p5) {
    const particles = new CircularParticleSet(100, 0, 5e-3);
    const player = new NotePlayer();

    p5.setup = async function () {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        const url = "../../assets/bodyAndSoul.mid"
        await player.load(url);
        player.setAllSustain(0.5);
        await player.play();
        particles.setSize(10);
        particles.setSpeedScale(5e-3);
    }

    //called on each frame
    p5.draw = function () {
        p5.background(0);
        p5.stroke(255);
        p5.noFill();
        particles.step(p5);
    }

    particles.setOnNotePlayed((detail) => {
        let minmax = player.getMinMaxPitch(0);
        particles.defaultOnNotePlayedWithMinMax(detail, minmax.minPitch, minmax.maxPitch);
    });
});