import NotePlayer from "../src/midi_player/NotePlayer.js";

new p5(function(p5){

    p5.setup = async function() {
        const url = "../assets/dailyLife.mid"
        const player = new NotePlayer();
        await player.load(url);
        player.setAllInstruments("marimba");
        await player.play();
    }

});