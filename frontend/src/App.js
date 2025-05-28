

import React, { useState, useRef, useEffect } from 'react';
import * as mm from '@magenta/music';
// import { MusicRNN, sequences } from '@magenta/music';


import * as Tone from 'tone';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [midiUrl, setMidiUrl] = useState('');

  const [ambientMidiUrl, setAmbientMidiUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [sequence, setSequence] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const svgRef = useRef(null);
  const visualizerRef = useRef(null);
  const samplerRef = useRef(null);
  const ambientSynthRef = useRef(null)

  useEffect(() => {
    //
    const pianoReverb = new Tone.Reverb({
      decay: 8,
      wet: 0.7 // equivalent to mix: 0.7
    }).toDestination();
    
    const pianoDelay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.025,
      wet: 0.1
    });
    
    const pianoFilter = new Tone.Filter({
      type: "lowpass",
      frequency: 1600,
      Q: 1
    });
    
    const pianoVolume = new Tone.Volume(-1); // subtle dynamic shaping
    
    // Connect in order: Sampler → Filter → Delay → Reverb
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
    }).connect(pianoVolume)

    samplerRef.current = sampler;

    // Ambient background layer
    const ambientSynth = new Tone.PolySynth(Tone.Synth, {
      // oscillator: { type: "sine" },
      oscillator: { type: "fatsawtooth", count: 3, spread: 40 },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.8,
        release: 1
      }
    });
    
    // NEW: Lower volume
    const ambientVolume = new Tone.Volume(-24); // Around -24 dB is subtle
    ambientSynthRef.current = ambientSynth;

    const ambientFilter = new Tone.Filter({
      type: "lowpass",
      frequency: 600,
      Q: 1
    });

    const ambientReverb = new Tone.Reverb({
      decay: 10,
      preDelay: 0.2
    }).toDestination();

    const ambientDelay = new Tone.FeedbackDelay("4n", 0.3).connect(ambientReverb);

    ambientSynth.chain(ambientVolume, ambientFilter, ambientDelay);

    // slow modulation
    const ambientLFO = new Tone.LFO("0.05hz", 400, 1000);
    ambientLFO.connect(ambientFilter.frequency);
    ambientLFO.start();
  
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
    setMidiUrl('');
    setSequence(null);
    if (svgRef.current) svgRef.current.innerHTML = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a .wav file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setUploadMessage(res.ok ? `✅ Uploaded: ${data.filename}` : `❌ Upload failed: ${data.error}`);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setUploadMessage("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/api/generate", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        const midiUrls = data.midi_url;
        const crossUrl = `http://127.0.0.1:5000${midiUrls.crossmodal}`;
        const ambientUrl = `http://127.0.0.1:5000${midiUrls.ambient}`;
        
        setMidiUrl(crossUrl);
        setAmbientMidiUrl(ambientUrl);
        loadMidiForPreview(crossUrl);
      } else {
        alert("❌ Generation failed: " + data.error);
      }
    } catch (err) {
      console.error("❌ Generation error:", err);
      alert("❌ Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const loadMidiForPreview = async (url) => {
    try {
      const res = await fetch(url);
      const midiData = await res.arrayBuffer();
      const seq = mm.midiToSequenceProto(midiData);
      setSequence(seq);

      if (svgRef.current) {
        svgRef.current.innerHTML = '';
        visualizerRef.current = new mm.WaterfallSVGVisualizer(seq, svgRef.current, {
          noteRGB: '0, 0, 0',
          activeNoteRGB: '255, 0, 0',
          pixelsPerTimeStep: 80,
          noteHeight: 6,
        });
      }
    } catch (err) {
      console.error("❌ Failed to load MIDI for preview:", err);
    }
  };

  const handlePlay = async () => {
    if (!sequence || !samplerRef.current) return;
  
    await Tone.start();
  
    // Play ambient background MIDI
    if (ambientMidiUrl) {
      try {
        const res = await fetch(ambientMidiUrl);
        const midiData = await res.arrayBuffer();
        const ambientSeq = mm.midiToSequenceProto(midiData);
  
        new Tone.Part((time, note) => {
          ambientSynthRef.current.triggerAttackRelease(
            Tone.Frequency(note.pitch, "midi"),
            note.endTime - note.startTime,
            time,
            Math.min(note.velocity || 0.5, 0.5)
          );
        }, ambientSeq.notes.map(n => [n.startTime, n])).start(0);
      } catch (err) {
        console.error("⚠️ Ambient MIDI playback failed:", err);
      }
    }

      const part = new Tone.Part((time, note) => {
        samplerRef.current.triggerAttackRelease(
          Tone.Frequency(note.pitch, "midi"),
          note.endTime - note.startTime + 1,
          time,
          Math.min(note.velocity || 0.8, 0.8)
        );
      
        if (visualizerRef.current) {
          visualizerRef.current.redraw(note); // ✅ PASS SAME OBJECT FROM continuedSeq
        }
      }, sequence.notes.map(n => [n.startTime, n])); // ✅ map directly from continuedSeq
  
    part.start(0);
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();
  
    playerRef.current = part;
    setIsPlaying(true);
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
      playerRef.current = null;
    }
  
    Tone.Transport.stop();
    Tone.Transport.cancel();
    ambientSynthRef.current.releaseAll();
    setIsPlaying(false);
  };
  

  return (
    <div className="container">
      <h1>Upload and Generate Accompaniment</h1>

      <input type="file" accept=".wav" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginTop: '10px' }} disabled={loading}>
        Upload WAV
      </button>

      {uploadMessage && <p>{uploadMessage}</p>}
      <hr />

      <button onClick={handleGenerate} disabled={loading || !selectedFile}>
        Generate Accompaniment
      </button>

      {loading && <p>Processing...</p>}

      {midiUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated MIDI</h3>
          <a href={midiUrl} target="_blank" rel="noopener noreferrer" download>Download MIDI</a>

          <div style={{ marginTop: '10px' }}>
            {/* <button onClick={handlePlay}>▶️ Play MIDI</button>
            <button onClick={handleStop}>⏹ Stop</button> */}
            <button onClick={handlePlay} disabled={isPlaying || !sequence}>Play MIDI
            </button>
            <button onClick={handleStop} disabled={!isPlaying}>Stop
            </button>
          </div>

          <div

  ref={svgRef} className="app-visualizer-container"></div>

        <button
          onClick={() => {
            const url = new URL(window.location.href);
            url.pathname = "/player";
            url.searchParams.set("midi", midiUrl);
            url.searchParams.set("ambient", ambientMidiUrl);
            window.open(url.toString(), "_blank"); // open in a new tab
          }}
          disabled={!midiUrl}
        >
          Open Fullscreen Player
        </button>


          {/* <audio controls src={midiUrl.replace('.mid', '.wav')} style={{ marginTop: '20px' }} /> */}
        </div>
      )}
    </div>
    
  );
}

export default App;

