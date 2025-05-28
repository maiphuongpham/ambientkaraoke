import CircularParticleSet from "../collections/CircularParticleSet.js";
import LineSet from "../collections/LineSet.js";
import ParticleSet from "../collections/ParticleSet.js";
import PianoRollWithPrimitives from "../collections/PianoRollWithPrimitives.js";
import QuadSet from "../collections/QuadSet.js";
import RippleSet from "../collections/RippleSet.js";
import NotePlayer from "../midi_player/NotePlayer.js";
import vec2 from "../utils/Vec2.js";
import Histogram from "../collections/Histogram.js";

//This example provides a multitrack, multi-primitive visualizer
//Each track is represented by a different color
//You can bind different primitives to different tracks
new p5(function (p5) {
    const viz = new PianoRollWithPrimitives(p5, null, true);
    const player = new NotePlayer();

    //set up the play settings and particle speed
    p5.setup = async function () {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        const url = "../../assets/alleycat.mid"
        await player.load(url);
        //set play settings
        player.setSustain(0.1, 0);
        player.setSustain(0.1, 1);
        player.setReverb(0.5, 1);

        //set instrument type
        player.setInstrument("electric_piano", 0);
        player.setInstrument("oboe", 1);
        player.setInstrument("bass", 2);
        await player.play();

        //set global visualization unit moving speed
        //speed scale (use whole number instead)
        viz.setSpeedScale(5e-2);

        //add primitives, and they listen to different tracks
        viz.addCollection(new ParticleSet(0, 5e-2, false, (detail) => { return [69, 202, 255] }));
        viz.addCollection(new QuadSet(1, 5e-2, false, (detail) => { return [255, 27, 107] }));
        viz.addCollection(new ParticleSet(2, 5e-2, false, (detail) => { return [255, 147, 15] }));
        viz.addCollection(new RippleSet(0, 5e-2, false, (detail) => { return [69, 202, 255] }));
        viz.addCollection(new Histogram(viz.getKeys(), 0, 5e-2, true));

        //piano color settings, each track has a different color
        viz.setColorGenerator(0, (detail) => {
            if (detail.trackNum == 0)
                return [69, 202, 255];
            else if (detail.trackNum == 1)
                return [255, 27, 107];
            else if (detail.trackNum == 2)
                return [255, 147, 15];
        });

        viz.setOnNotePlayed(0,(detail)=>{
            
        })

    }

    //called on each frame, the draw call loop
    p5.draw = function () {
        viz.step(p5);
    }
});