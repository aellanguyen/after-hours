# Current interface: simple tap → finish → generate

The active UI is the simple Google Lyria workflow again. The sequencer modules and example files below are retained locally but are not loaded by the app. Room controls are unchanged. Your tap positions and loop length are sent as a textual groove description; a clean local kick preserves the exact taps. Lyria is asked to reduce its drums and generate layered bass, harmony and synth textures. This does not guarantee sample-accurate AI accents or match the sound of reference recordings.

# AFTERHOURS — tap-led composition studio

Local clone of the original club visualization, expanded with a note-based music composer. The current interface uses procedural composition and synthesized instruments. It does not use Lyria clips to construct the score.

## Run

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python server.py
```

Open http://localhost:8000. No API key is required for the composer. Use this server rather than a generic file server: it serves an explicit list of public files and protects `.env`.

## Create a piece

1. Tap a rhythm with the pad or Space (at least two hits), then Finish rhythm. Captures last up to eight seconds. Set the desired tempo before tapping. Individual hit offsets are preserved in seconds at that tempo, without quantization or forced techno BPM inference.
2. Choose a 32-bar opus (A / B / A′ / C) or a 56-bar song (intro, verse, chorus, verse, chorus, bridge, final chorus, outro).
3. Choose key, one of 10 scales (including major/minor pentatonic), 40 distinct progression templates, 50 synth voices and 20 rhythm presets. Presets replace captured taps only on explicit Replace. Harmony for pentatonic/blues uses the parent major/minor scale; the melody stays in the selected scale. Progression names describe degree recipes interpreted in the selected scale, rather than fixed borrowed chord qualities.
4. Compose creates related motifs and section variations, with tap attacks repeated in drums, bass and melody. Intro/outro thin the arrangement; accompanying hats and snares provide subdivisions. The kick follows your taps rather than an independent four-on-the-floor track.
5. Edit Melody, Chords, Bass or Drums in the piano roll. Click to add, drag to move, drag the right edge to resize, right-click or Delete to remove. Use the track selector, four-bar paging, section buttons and position slider to navigate; Follow tracks playback. New/dragged notes snap to sixteenth notes; original captured timings remain free.
6. Randomize All changes key, scale, tempo, chords, instruments, FX and motif seed, preserving captured taps and the chosen structure. Instrument-only randomization keeps all notes; chord randomization recomposes harmony and motifs.
7. Reverb, delay/echo and Space (room size/stereo width) work in playback and audio export. Mute individual tracks. Save project preserves edited notes and musical settings. Header Save/Load preserves the room and composition together.

## Export

- WAV: full stereo 16-bit PCM, 44.1 kHz, including FX and a tail.
- MP3: real local lamejs encoding at 192 kbps, including FX.
- MIDI: type 1, conductor plus four tracks, 480 PPQ, tempo, 4/4 meter, section markers and GM instrument programs. MIDI is a score: playback timbres and FX depend on the receiving instrument/player.

Audio renders locally using OfflineAudioContext. Longer songs and exports can take time. The acoustic/orchestral soundbank entries are synthesized approximations, not sampled instruments. See THIRD_PARTY.md for dependency licenses. Example rendered files are in `examples/`.

## Club controls

Pulse Depth sets contrast; Punch / Sharpness sets decay. During playback pulse follows measured 35–180 Hz bass attacks from the actual output. Ceiling/spot pulse, the center board and crowd share that response. Silent preview uses a tempo clock. Reduced-motion preferences disable pulsing, dancing and sweeping.

EDIT selects all pillars, an individual pillar or the center LED board. Each supports text, drawing, animated bars, brightness and color. The ceiling/spotlight controls set color, level, beam width, sweep and beat sync. Crowd Energy controls dancing during playback.

## Legacy AI backend

The older `/api/music/*` endpoints remain available but the composer UI does not call them. If used, they require a valid Gemini API key (`python3 setup_key.py`) and Google Lyria access/quota. Keys are stored privately in `.env`, excluded from Git and never served as static assets. This is a localhost tool; public deployment needs authentication and usage limits.

## Verification

Syntax and model tests cover 10 scales, 40 distinct progressions, 50 voices and 20 patterns; exact free-tap timing; score bounds and scale membership; UI mounting, randomization, form changes, piano editing and project roundtrips in a simulated DOM. MIDI is independently parsed for structure and balanced note events. Real offline audio rendering and MP3/WAV encoding are tested separately. Browser visual/audio listening verification is unavailable in the current environment.
