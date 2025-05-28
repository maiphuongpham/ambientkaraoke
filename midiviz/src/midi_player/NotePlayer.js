import { Reverb, SplendidGrandPiano, Soundfont } from "https://unpkg.com/smplr/dist/index.mjs"; // needs to be a url
import FileHandler from "./FileHandler.js";
import { INSTRUMENTS } from "./Instruments.js";

var constraints = { audio: true }

//A MIDI note player
class NotePlayer {
    tracks = [];
    trackSettings = [];

    constructor() {
        this.tracks = [];
        this.trackSettings = [];
    };

    /**
     * @description get min and max pitch of a certain track
     * write result to trackSettings array
     */
    calcMinMaxPitch(idx) {
        let min = 127;
        let max = 0;
        this.tracks[idx].notes.forEach(note => {
            if (note.midi > max) max = note.midi;
            if (note.midi < min) min = note.midi;
        });

        this.trackSettings[idx].minPitch = min;
        this.trackSettings[idx].maxPitch = max;
    }

    /**
 * @description  Get min and max pitch of all tracks.
    Write result to trackSettings array
 */
    calcAllMinMaxPitch() {
        for (let i = 0; i < this.trackSettings.length; i++)
            this.calcMinMaxPitch(i);
    }

    getMinMaxPitch(idx) {
        return { minPitch: this.trackSettings[idx].minPitch, maxPitch: this.trackSettings[idx].maxPitch };
    }

    //set reverb amount of a certain track
    setReverb(r, idx = 0) {
        //assert idx is valid
        console.assert(idx >= 0 && idx < this.trackSettings.length, { msg: "index out of bound" });
        this.trackSettings[idx].reverb = r;
    }

    setSustain(s, idx = 0) {
        //assert idx is valid
        console.assert(idx >= 0 && idx < this.trackSettings.length, { msg: "index out of bound" });
        this.trackSettings[idx].sustain = s;
    }

    //Not recommended for wind instruments
    setAllSustain(s) {
        this.trackSettings.forEach(track => {
            track.sustain = s;
        });
    }

    /**
     * @description Set instrument type of a certain track
     */
    setInstrument(instr, idx = 0) {
        //assert idx is valid
        console.assert(idx >= 0 && idx < this.trackSettings.length, { msg: "index out of bound" });
        //assert instrument is valid
        console.assert(INSTRUMENTS.hasOwnProperty(instr.toLowerCase()), { msg: "invalid instrument" });
        this.trackSettings[idx].instrument = INSTRUMENTS[instr.toLowerCase()];
    }

    /**
     * @description Get track setting of a certain track
     */
    getTrackSetting(idx) {
        //assert idx is valid
        console.assert(idx >= 0 && idx < this.trackSettings.length, { msg: "index out of bound" });
        return this.trackSettings[idx];
    }

    //shift note pitch
    shiftNotes(shift, idx = 0) {
        //assert idx is valid
        console.assert(idx >= 0 && idx < this.tracks.length, { msg: "index out of bound" });
        this.trackSettings[idx].shift = shift;
        this.trackSettings[idx].minPitch += shift;
        this.trackSettings[idx].maxPitch += shift;
    };

    //shift note pitch for all tracks
    shiftAllNotes(shift) {
        this.trackSettings.forEach(track => {
            track.shift = shift;
            track.minPitch += shift;
            track.maxPitch += shift;
        });
    }

    //set instrument type for all tracks
    setAllInstruments(instr) {
        console.assert(INSTRUMENTS.hasOwnProperty(instr.toLowerCase()), { msg: "invalid instrument" });
        this.trackSettings.forEach(track => {
            track.instrument = INSTRUMENTS[instr.toLowerCase()];
        });
    }

    //set reverb amount for all tracks
    setAllReverb(r) {
        this.trackSettings.forEach(track => {
            track.reverb = r;
        });
    }


    /**
     * @description Load the midi file, async method since load Midi is async
     */
    async load(url) {
        const handler = new FileHandler();
        await handler.loadMidi(url).then(() => {
            this.tracks = handler.convertAllToCustomNotes();
            this.tracks.forEach(track => {
                //load the track settings
                //each track has an instrument and reverb settings
                this.trackSettings.push({ instrument: INSTRUMENTS.hasOwnProperty(track.instrument.toLowerCase()) ? INSTRUMENTS[track.instrument.toLowerCase()] : "acoustic_grand_piano", reverb: 0.3, sustain: 0, shift: 0, minPitch: 127, maxPitch: 0 });
                this.calcAllMinMaxPitch();
            });
        });

    };


    /**
     * @description  Play the song (all tracks). By default with piano
     */
    defaultPlay() {
        //Resume Audio Context
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                const context = new AudioContext(); // create the audio context
                const now = context.currentTime;
                const reverb = new Reverb(context);


                //create and load the instrument
                const piano = new SplendidGrandPiano(context, {});
                //play piano note based on the custom note format
                piano.loaded().then(() => {
                    for (let i = 0; i < this.tracks.length; i++) {
                        this.tracks[i].notes.forEach(note => {
                            var playNote = note.midi + this.trackSettings[i].shift;
                            piano.start({
                                note: playNote, velocity: note.velocity, duration: note.duration + this.trackSettings[i].sustain, time: note.time + now,
                                onStart: () => {
                                    note.midi = playNote;
                                    var e = new CustomEvent("notePlayed", { bubbles: true, detail: { note: note, trackNum: i } });
                                    document.dispatchEvent(e);
                                }, onEnded: () => {
                                    note.midi = playNote;
                                    var e = new CustomEvent("noteEnded", { bubbles: true, detail: { note: note, trackNum: i } });
                                    document.dispatchEvent(e);
                                }
                            });
                        });
                    }
                });

            })
    };

    /**
     * @description  Play the song (all tracks) with specified track settings
     */
    async play() {

        const context = new AudioContext(); // create the audio context
        const now = context.currentTime;
        const reverb = new Reverb(context);

        for (let i = 0; i < this.tracks.length; i++) {
            const instr = await new Soundfont(context, { instrument: this.trackSettings[i].instrument }).load;
            instr.output.addEffect("reverb", reverb, this.trackSettings[i].reverb);

            this.tracks[i].notes.forEach(note => {
                var playNote = note.midi + this.trackSettings[i].shift;
                instr.start({
                    note: playNote, velocity: note.velocity, duration: note.duration + this.trackSettings[i].sustain, time: note.time + now,
                    onStart: () => {
                        note.midi = playNote;
                        var e = new CustomEvent("notePlayed", { bubbles: true, detail: { note: note, trackNum: i } });
                        document.dispatchEvent(e);
                    }, onEnded: () => {
                        note.midi = playNote;
                        var e = new CustomEvent("noteEnded", { bubbles: true, detail: { note: note, trackNum: i } });
                        document.dispatchEvent(e);
                    }
                });
            });
        }

    };

};

export default NotePlayer;