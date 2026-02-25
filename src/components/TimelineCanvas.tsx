import React, { useRef, useEffect, useState } from "react";
import type { Lane } from "../models/Lane";

interface Props {
    lanes: Lane[];
}

const LANE_HEIGHT = 100;
const MIN_SCALE = 50;
const MAX_SCALE = 1000;

export default function TimelineCanvas({ lanes }: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [pixelsPerSecond, setPixelsPerSecond] = useState(200);

    const getTotalDuration = () => {
        let max = 5; // minimum 5 seconds visible
        lanes.forEach(lane => {
            lane.phonemes.forEach(ph => {
                const end = ph.start + ph.duration;
                if (end > max) max = end;
            });
        });
        return max;
    };

    const draw = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const totalDuration = getTotalDuration();
        const containerWidth = containerRef.current?.clientWidth || 1000;

        const width = Math.max(
            totalDuration * pixelsPerSecond,
            containerWidth + 200 // extra padding
        );

        canvas.width = width;
        canvas.height = lanes.length * LANE_HEIGHT;

        ctx.fillStyle = "#181818";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawTimeGrid(ctx, width, canvas.height);
        drawLanes(ctx);
    };

    const drawTimeGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {

        const seconds = Math.ceil(width / pixelsPerSecond);

        for (let s = 0; s <= seconds; s++) {

            const x = s * pixelsPerSecond;

            // Major second line
            ctx.strokeStyle = "#333";
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();

            // Label
            ctx.fillStyle = "#888";
            ctx.fillText(s + "s", x + 4, 12);

            // Sub divisions (4 per second)
            for (let i = 1; i < 4; i++) {
                const subX = x + (i * pixelsPerSecond) / 4;

                ctx.strokeStyle = "#222";
                ctx.beginPath();
                ctx.moveTo(subX, 0);
                ctx.lineTo(subX, height);
                ctx.stroke();
            }
        }
    };

    const drawLanes = (ctx: CanvasRenderingContext2D) => {

        lanes.forEach((lane, laneIndex) => {

            const yOffset = laneIndex * LANE_HEIGHT;

            // Lane divider
            ctx.strokeStyle = "#444";
            ctx.beginPath();
            ctx.moveTo(0, yOffset);
            ctx.lineTo(ctx.canvas.width, yOffset);
            ctx.stroke();

            lane.phonemes.forEach(ph => {

                const x = ph.start * pixelsPerSecond;
                const w = ph.duration * pixelsPerSecond;

                ctx.fillStyle =
                    ph.type === "vowel"
                        ? "#00d4ff"
                        : "#ff7a00";

                ctx.fillRect(
                    x,
                    yOffset + 30,
                    w,
                    40
                );

                ctx.fillStyle = "#000";
                ctx.fillText(
                    ph.symbol,
                    x + 5,
                    yOffset + 55
                );
            });

        });
    };

    const handleWheel = (e: React.WheelEvent) => {

        e.preventDefault();
        e.stopPropagation();

        const zoomFactor = 1.1;

        if (e.deltaY < 0) {
            setPixelsPerSecond(prev =>
                Math.min(prev * zoomFactor, MAX_SCALE)
            );
        } else {
            setPixelsPerSecond(prev =>
                Math.max(prev / zoomFactor, MIN_SCALE)
            );
        }
    };

    useEffect(() => {
        draw();
    }, [lanes, pixelsPerSecond]);

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            style={{
                overflowX: "auto",
                overflowY: "hidden",
                borderTop: "1px solid #333",
                height: lanes.length * LANE_HEIGHT
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block"
                }}
            />
        </div>
    );
}