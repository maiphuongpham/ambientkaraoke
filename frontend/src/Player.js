import React, { useEffect, useRef, useState } from 'react';
import * as mm from '@magenta/music';
import * as Tone from 'tone';
import './Player.css';

function Player() {
  const svgRef = useRef(null);
  const visualizerRef = useRef(null);
  const samplerRef = useRef(null);
  const ambientSynthRef = useRef(null);
  const [sequence, setSequence] = useState(null);

  const query = new URLSearchParams(window.location.search);
  const midiUrl = query.get("midi");
  const ambientUrl = query.get("ambient");

  useEffect(() => {
    // Effects chain for sampler
    const pianoReverb = new Tone.Reverb({ decay: 8, wet: 0.7 }).toDestination();
    const pianoDelay = new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.025, wet: 0.1 });
    const pianoFilter = new Tone.Filter({ type: "lowpass", frequency: 1600, Q: 1 });
    const pianoVolume = new Tone.Volume(-1);
    pianoVolume.connect(pianoFilter);
    pianoFilter.connect(pianoDelay);
    pianoDelay.connect(pianoReverb);

    const sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => console.log("✅ Sampler loaded")
    }).connect(pianoVolume);
    samplerRef.current = sampler;

    // Ambient synth
    const ambientSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "fatsawtooth", count: 3, spread: 40 },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.8,
        release: 1
      }
    });

    const ambientVolume = new Tone.Volume(-24);
    const ambientFilter = new Tone.Filter({ type: "lowpass", frequency: 600, Q: 1 });
    const ambientReverb = new Tone.Reverb({ decay: 10, preDelay: 0.2 }).toDestination();
    const ambientDelay = new Tone.FeedbackDelay("4n", 0.3).connect(ambientReverb);

    ambientSynth.chain(ambientVolume, ambientFilter, ambientDelay);
    ambientSynthRef.current = ambientSynth;

    const ambientLFO = new Tone.LFO("0.05hz", 400, 1000);
    ambientLFO.connect(ambientFilter.frequency);
    ambientLFO.start();
  }, []);

  useEffect(() => {
    const fetchMidi = async () => {
      const res = await fetch(midiUrl);
      const data = await res.arrayBuffer();
      const seq = mm.midiToSequenceProto(data);
      setSequence(seq);

      if (svgRef.current) {
        svgRef.current.innerHTML = '';
        visualizerRef.current = new mm.WaterfallSVGVisualizer(seq, svgRef.current, {
          noteRGB: '255,255,255',
          activeNoteRGB: '255,150,180',
          pixelsPerTimeStep: 200,
          noteHeight: 7,
        });
      }
    };

    if (midiUrl) fetchMidi();
  }, [midiUrl]);

  const handlePlay = async () => {
    await Tone.start();

    // Ambient
    if (ambientUrl) {
      const res = await fetch(ambientUrl);
      const ambientData = await res.arrayBuffer();
      const ambientSeq = mm.midiToSequenceProto(ambientData);

      new Tone.Part((time, note) => {
        ambientSynthRef.current.triggerAttackRelease(
          Tone.Frequency(note.pitch, "midi"),
          note.endTime - note.startTime,
          time,
          Math.min(note.velocity || 0.5, 0.5)
        );
      }, ambientSeq.notes.map(n => [n.startTime, n])).start(0);
    }

    // Main sequence
    const part = new Tone.Part((time, note) => {
      samplerRef.current.triggerAttackRelease(
        Tone.Frequency(note.pitch, "midi"),
        note.endTime - note.startTime + 1,
        time,
        Math.min(note.velocity || 0.8, 0.8)
      );

      if (visualizerRef.current) {
        visualizerRef.current.redraw(note);
      }
    }, sequence.notes.map(n => [n.startTime, n]));

    part.start(0);
    Tone.Transport.start();
  };

  return (
    <div className="fullscreen-player">
      <div className="visualizer-container" ref={svgRef}></div>
      <button className="fullscreen-play" onClick={handlePlay}>Play</button>
    </div>
  );
}

export default Player;
