import { useRef, useEffect } from "react";

const SCALE = 200;
const HEIGHT = 100;

import type {Phoneme, Props } from "../types/phoneme";

export default function TimelineCanvas({ phonemes }: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        canvas.width = 2000;
        canvas.height = HEIGHT;

        ctx.fillStyle = "#181818";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        phonemes.forEach((ph: Phoneme)=>{
            const x = ph.start * SCALE;
            const w = ph.duration * SCALE;

            ctx.fillStyle = ph.type==="vowel" ? "#00d4ff" : "#ff7a00";
            ctx.fillRect(x, 30, w, 40);

            ctx.fillStyle = "#000";
            ctx.fillText(ph.symbol, x+5, 55);
        });

    },[phonemes]);

    return <canvas ref={canvasRef} style={{width:"100%"}}/>
}