import {useRef, useEffect} from "react";

const NOTE_HEIGHT = 25;
const MIN_MIDI = 40;
const MAX_MIDI = 84;

const NOTE_NAMES = [
    "C", "C#", "D", "D#", "E",
    "F", "F#", "G", "G#", "A", "A#", "B"
];

export default function LanePianoRoll() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        canvas.width = 65;

        const totalNotes = MAX_MIDI - MIN_MIDI;

        // Calculate number of white keys only
        const whiteMidis: number[] = [];

        for (let m = MIN_MIDI; m <= MAX_MIDI; m++) {
            const note = NOTE_NAMES[m % 12];
            if (!note.includes("#")) {
                whiteMidis.push(m);
            }
        }

        const totalWhite = whiteMidis.length;

        canvas.height = totalWhite * NOTE_HEIGHT;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // -------- DRAW WHITE KEYS --------
        whiteMidis.reverse().forEach((midi, index) => {

            const y = index * NOTE_HEIGHT;

            ctx.fillStyle = "#f5f5f5";
            ctx.fillRect(0, y, canvas.width, NOTE_HEIGHT);

            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 1;
            ctx.strokeRect(0, y, canvas.width, NOTE_HEIGHT);

            const noteName = NOTE_NAMES[midi % 12];

            if (noteName === "C") {
                const octave = Math.floor(midi / 12) - 1;
                ctx.fillStyle = "#444";
                ctx.font = "11px sans-serif";
                ctx.fillText(noteName + octave, canvas.width * 0.75, y + 17);
            }
        });

        // -------- DRAW BLACK KEYS --------
        whiteMidis.reverse(); // back to ascending for positioning

        for (let m = MIN_MIDI; m <= MAX_MIDI; m++) {

            const noteName = NOTE_NAMES[m % 12];
            if (!noteName.includes("#")) continue;

            // Black keys exist after certain white notes only
            const previousWhiteIndex =
                whiteMidis.findIndex(w => w > m) - 1;

            if (previousWhiteIndex < 0) continue;

            const y =
                (totalWhite - previousWhiteIndex - 1) * NOTE_HEIGHT
                - NOTE_HEIGHT * 0.35;

            const blackWidth = canvas.width * 0.6;
            const blackHeight = NOTE_HEIGHT * 0.7;
            const blackX = 0;

            ctx.fillStyle = "#111";
            ctx.fillRect(
                blackX,
                y,
                blackWidth,
                blackHeight
            );
        }

    }, []);

    return (
        <div style={{overflowY: "auto", height: "100%"}}>
            <canvas ref={canvasRef}/>
        </div>
    );
}