import PianoRollWithPrimitives from "./collections/PianoRollWithPrimitives.js";
import NotePlayer from "./midi_player/NotePlayer.js";
import vec2 from "./utils/Vec2.js";

new p5(function (p5) {
    const roll = new PianoRollWithPrimitives(p5);
    const player = new NotePlayer();

    p5.setup = async function () {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(255);
        const url = "../assets/bodyAndSoul.mid"
        await player.load(url);
        player.setAllSustain(0.7);
        await player.play();
    }

    //called on each frame
    p5.draw = function () {
        roll.step(p5);
    }

});