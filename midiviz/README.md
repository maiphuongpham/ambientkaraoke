# MIDIViz

This library is a web-based MIDI player & visualizer (with particles). It includes a MIDI parser over `tone.js` library,  a wrapper layer over `smplr` library for MIDI player and `collection` classes for visualization, providing a quick MIDI-to-visualization control.

The overall library design follows the observer design pattern. The note player emits note event and each collection listens to the note event and act correspondingly.



![image-20231107021554556](https://s2.loli.net/2023/11/07/ROFeCU3uWi9cLY5.png)

### Examples:

```js
import NotePlayer from "../src/NotePlayer.js";

//this example plays a midi song with default settings (piano for all tracks)
new p5(function(p5){

    p5.setup = async function() {
        const url = "../assets/dailyLife.mid"
        const player = new NotePlayer();
        await player.load(url);
        player.defaultPlay();
    }

});
```

```js
new p5(function(p5){
	const roll = new PianoRollWithPrimitives(p5, ParticleSet);
    const player = new NotePlayer();

    //set up the play settings and particle speed
    p5.setup = async function () {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(255);
        const url = "../../assets/uneBarque.mid"
        await player.load(url);
        player.setAllSustain(0.7);
        await player.play();
        roll.setSpeedScale(5e-2);
    }

    //called on each frame, the draw call loop
    p5.draw = function () {
        roll.step(p5);
    }
});
```



### Setup

* Usage from the browser, all of the dependencies are either in ES6 module or vanilla js. Migration to package manager is on the TODO List.

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>playMusic</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/addons/p5.sound.min.js"></script>
  <script src="https://unpkg.com/@tonejs/midi"></script>

   <!-- Your sketch is here -->
  <script type="module" src="./piano_particle.js"></script>
</head>
```



### Usage

#### Load & Play

* Load and play from MIDI

```js
import NotePlayer from "../src/NotePlayer.js";   

const player = new NotePlayer();
await player.load(url);
player.defaultPlay();
//by default, all the notes will be played with Piano
```



#### Play Settings

* Shift overall note pitch

```js
//shift the first track with 1 octave above
player.shiftNotes(12,1);
```

* Change instrument

```js
player.setInstrument("piano",0);
//all available instruments are listed in Instruments.js
```

* Change reverb

```js
player.setReverb(.3);
```



#### Custom Event (Refactor required)

* Custom event with `onStart()` and `onEnded()` from `smplr` library

```js
piano.loaded().then(() => {
                for(let i=0;i<this.tracks.length;i++){
                    this.tracks[i].notes.forEach(note => {
                        piano.start({ note: note.midi+this.trackSettings[i].shift, velocity: note.velocity, duration: note.duration, time: note.time + now, onStart: () => {
                            var e = new CustomEvent("notePlayed",{bubbles: true, detail:{pitch:note.midi, trackNum:i }});
                            document.dispatchEvent(e);
                          }});
                    });
                }
            });
```



#### Adding a visualization collection

```js
const viz = new PianoRollWithPrimitives(p5, ParticleSet);

//set global visualization unit moving speed
//speed scale (use whole number instead)
viz.setSpeedScale(5e-2);

//add primitives, and they listen to different tracks
viz.addCollection(new ParticleSet(0, 5e-2, false, (detail) => { return [69, 202, 255] }));
```

#### Override visualization pattern

```js
viz.setOnNotePlayed(0,(detail)=>{

})
```



### Data Structures

* tracks

  * Array of track information, each track is as below

    `{instrument: "name of instrument", notes = []}`

  * Each note is a JSON object with below entries

    ` {midi: 0-127, velocity: 0-127, time: the time the note start to play in second, duration: note duration in second, noteName: (e.g. C4)}`

* trackSettings

  * Array of tracks’ play settings

    * Each element is as below

      ` instrument:, reverb: time in second, minPitch: 0-127, maxPitch:0-127`

  * By default, the instrument will be set to the one specified in the MIDI file, if the specified one is not available in the sound font, the track’s instrument will be set to piano.
  
* Collection

  * A set of primitives of the same type
  * Each collection has below properties:
    * `collection`: array of primitives
    * `onNotePlayed`: callback when a note is being played
    * `onNoteEnded`: callback when a note ended
    * `listenToAll`: if the collection listens to all tracks’ event
    * `speed_scale`: speed factor changes the initial acceleration
    * `colorGenerator`: default color pattern for the default callback
  



### Goals

* A easy to use Load and Play MIDI player
* A visualizer with customizable settings and different looks
* Corresponding interface with `smplr` library

#### 
