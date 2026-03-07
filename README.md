# Electro

Electro is a desktop DAW-style vocal pitch editing frontend for RVC voice synthesis.

## Stack

- Electron
- React
- TypeScript
- Vite

## Implemented Frontend Architecture

- Modular editor layout with timeline + lanes + inspector
- Canvas-rendered lanes (`Note`, `Pitch`, `Vibrato`, `Phoneme`)
- Centralized editor state with undo/redo history
- Interaction system (select, drag, resize, pitch point editing)
- Grid snapping and timeline ruler/grid/playhead
- Backend request abstraction (`generateVibrato`, `updatePitch`, `generatePhonemes`)
- Pluggable phoneme parser

## Project Structure

```text
src/
  audio/
  components/
  editor/
  timeline/
  lanes/
  phonemes/
  vibrato/
  parser/
  state/
  services/
  types/
  styles/
  utils/
```

## Scripts

- `npm run dev`: start Vite web frontend
- `npm run electron:dev`: start Electron + Vite dev environment
- `npm run build`: build TypeScript and Vite bundle
- `npm run electron:start`: build and run Electron against built files
- `npm run typecheck`: run TypeScript checks
- `npm run lint`: run ESLint

## Backend Contract Notes

Frontend currently sends structured requests only. Vibrato curves are not generated client-side.

`POST /generateVibrato`

```json
{
  "noteId": "n1",
  "startTime": 1.0,
  "endTime": 2.0,
  "frequency": 6.5,
  "amplitude": 0.3,
  "interpolation": "sine"
}
```

## Quick Start

1. `npm install`
2. `npm run electron:dev`
