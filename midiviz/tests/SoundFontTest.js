//using sound font and P5.sound.js library to play midi notes
import { SplendidGrandPiano, Soundfont } from "../external/smplr/index.mjs"; // needs to be a url
var constraints = { audio: true } // add video constraints if required

//Resume Audio Context
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        const context = new AudioContext(); // create the audio context
        const piano = new SplendidGrandPiano(context, {}); // create and load the instrument
        const guitar = new Soundfont(context, { instrument: "acoustic_guitar_nylon" });

        //play piano note and guitar note
        piano.loaded().then(() => {
            piano.start({ note: 60, velocity: 80, duration: 0.5 });
        });

        guitar.loaded().then(() => {
            guitar.start({ note: 60, velocity: 80, duration: 1.0 });
        });

    })


