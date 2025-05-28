class FileHandler {
    //Tracks is an array of MidiTrack objects
    //Each MidiTrack object has a name and notes array
    //Each note object has a midi, velocity, times, duration info
    tracks = [];
    constructor() {
        this.tracks = [];
    }

    //use Tone.js to parse MIDI file
    //Tone.js@https://github.com/Tonejs/Midi
    //use by include from cdn <script src="https://unpkg.com/@tonejs/midi"></script>
    //or include from npm import {Midi} from '@tonejs/midi'
    async loadMidi(filePath) {
        const midi = await Midi.fromUrl(filePath);
        midi.tracks.forEach(track => {
            this.tracks.push(track);
        });
    }

    //return the name of the track
    getTrackName(idx) {
        //assert idx is valid
        console.assert(idx >= 0 && idx < this.tracks.length, { msg: "index out of bound" });
        return this.tracks[idx].name;
    }

    //return the notes of the track
    getTrackNotes(idx) {
        //assert idx is valid
        console.assert(idx >= 0 && idx < this.tracks.length, { msg: "index out of bound" });
        return this.tracks[idx].notes;
    }

    //return the number of tracks
    getTrackCount() {
        return this.tracks.length;
    }

    //convert midi notes to custom note format for a single track
    convertToCustomNotes(idx) {
        let customNotes = { instrument: this.getTrackName(idx), notes: [] }

        //midi: 0-127, velocity: 0-127
        //time: seconds, duration: seconds 
        //noteName: e.g.(C4)
        this.getTrackNotes(idx).forEach(note => {
            //convert midi note to p5 note
            //p5 note has midi, velocity, time, duration
            let customNote = { midi: note.midi, velocity: Math.floor(note.velocity * 127), time: note.time, duration: note.duration, noteName: note.name };
            customNotes.notes.push(customNote);
        });

        return customNotes;
    }

    //convert midi notes to custom note format for all tracks
    convertAllToCustomNotes() {
        let customNotes = [];

        for (let i = 0; i < this.getTrackCount(); i++) {
            customNotes.push(this.convertToCustomNotes(i));
        }

        return customNotes;
    }
}

export default FileHandler;
