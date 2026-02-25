import React, { useRef, useEffect, useState } from "react";
import type { Lane } from "../models/Lane";
import LanePianoRoll from './LanePianoRoll.tsx';
import LaneList from './LaneList';

interface Props {
    lanes: Lane[];
    setLanes: React.Dispatch<React.SetStateAction<Lane[]>>;
}


const LANE_HEIGHT = 300;
const MIN_SCALE = 50;
const MAX_SCALE = 1000;

const SNAP_DIVISION = 0.25; // 250ms grid
const SNAP_PIXELS = 8;



export default function TimelineCanvas({ lanes, setLanes }: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                setIsCtrlPressed(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.ctrlKey) {
                setIsCtrlPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };

    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor =
                isCtrlPressed ? "grabbing" : "default";
        }
    }, [isCtrlPressed]);

    const snapTime = (
        rawTime: number,
        lane: Lane,
        excludeId: string
    ) => {

        const snapThresholdTime = SNAP_PIXELS / pixelsPerSecond;

        // 1️⃣ Snap to grid
        const snappedGrid =
            Math.round(rawTime / SNAP_DIVISION) * SNAP_DIVISION;

        if (Math.abs(snappedGrid - rawTime) < snapThresholdTime) {
            return snappedGrid;
        }

        // 2️⃣ Snap to neighbor phonemes
        for (const ph of lane.phonemes) {

            if (ph.id === excludeId) continue;

            const start = ph.start;
            const end = ph.start + ph.duration;

            if (Math.abs(start - rawTime) < snapThresholdTime) {
                return start;
            }

            if (Math.abs(end - rawTime) < snapThresholdTime) {
                return end;
            }
        }

        return rawTime;
    };

    const clampNoOverlap = (
        start: number,
        duration: number,
        lane: Lane,
        excludeId: string
    ) => {

        let newStart = start;
        let newDuration = duration;

        for (const ph of lane.phonemes) {

            if (ph.id === excludeId) continue;

            const phStart = ph.start;
            const phEnd = ph.start + ph.duration;

            const newEnd = newStart + newDuration;

            // If overlapping from left
            if (newStart < phEnd && newEnd > phStart) {

                if (newStart < phStart) {
                    newDuration = phStart - newStart;
                } else {
                    newStart = phEnd;
                }
            }
        }

        return {
            start: Math.max(0, newStart),
            duration: Math.max(0.05, newDuration)
        };
    };

    const [dragState, setDragState] = useState<{
        type: "move" | "resize-left" | "resize-right";
        laneIndex: number;
        phonemeId: string;
        startMouseX: number;
        originalStart: number;
        originalDuration: number;
    } | null>(null);

    const RESIZE_MARGIN = 6;

    const [pixelsPerSecond, setPixelsPerSecond] = useState(200);

    // const _getMouseTime = (clientX: number) => {
    //     const rect = canvasRef.current!.getBoundingClientRect();
    //     const x = clientX - rect.left;
    //     return x / pixelsPerSecond;
    // };

    const handleMouseDown = (e: React.MouseEvent) => {

        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const laneIndex = Math.floor(y / LANE_HEIGHT);
        const lane = lanes[laneIndex];
        if (!lane) return;

        // const time = x / pixelsPerSecond;

        for (const ph of lane.phonemes) {

            const startX = ph.start * pixelsPerSecond;
            const endX = (ph.start + ph.duration) * pixelsPerSecond;

            if (x >= startX && x <= endX) {

                let type: "move" | "resize-left" | "resize-right" = "move";

                if (x - startX < RESIZE_MARGIN) type = "resize-left";
                else if (endX - x < RESIZE_MARGIN) type = "resize-right";

                setDragState({
                    type,
                    laneIndex,
                    phonemeId: ph.id,
                    startMouseX: x,
                    originalStart: ph.start,
                    originalDuration: ph.duration
                });

                return;
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {

        if (!dragState) return;

        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const deltaPixels = x - dragState.startMouseX;
        const deltaTime = deltaPixels / pixelsPerSecond;

        setLanes(prev =>
            prev.map((lane, laneIndex) => {

                if (laneIndex !== dragState.laneIndex) return lane;

                return {
                    ...lane,
                    phonemes: lane.phonemes.map(ph => {

                        if (ph.id !== dragState.phonemeId) return ph;

                        // -------- MOVE --------
                        if (dragState.type === "move") {

                            let newStart =
                                dragState.originalStart + deltaTime;

                            if (!isCtrlPressed) {
                                newStart = snapTime(newStart, lane, ph.id);
                            }

                            const clamped = clampNoOverlap(
                                newStart,
                                ph.duration,
                                lane,
                                ph.id
                            );

                            return {
                                ...ph,
                                start: clamped.start,
                                duration: clamped.duration
                            };
                        }

                        // -------- RESIZE RIGHT --------
                        if (dragState.type === "resize-right") {

                            let newDuration =
                                dragState.originalDuration + deltaTime;

                            const rawEnd =
                                dragState.originalStart + newDuration;

                            let snappedEnd = rawEnd;

                            if (!isCtrlPressed) {
                                snappedEnd = snapTime(rawEnd, lane, ph.id);
                            }

                            newDuration =
                                snappedEnd - dragState.originalStart;

                            const clamped = clampNoOverlap(
                                ph.start,
                                newDuration,
                                lane,
                                ph.id
                            );

                            return {
                                ...ph,
                                duration: clamped.duration
                            };
                        }

                        // -------- RESIZE LEFT --------
                        if (dragState.type === "resize-left") {

                            let newStart =
                                dragState.originalStart + deltaTime;

                            if (!isCtrlPressed) {
                                newStart = snapTime(newStart, lane, ph.id);
                            }

                            const newDuration =
                                dragState.originalDuration -
                                (newStart - dragState.originalStart);

                            const clamped = clampNoOverlap(
                                newStart,
                                newDuration,
                                lane,
                                ph.id
                            );

                            return {
                                ...ph,
                                start: clamped.start,
                                duration: clamped.duration
                            };
                        }

                        return ph;
                    })
                };
            })
        );
    };

    const handleMouseUp = () => {
        setDragState(null);
    };

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

    // const handleWheel = (e: React.WheelEvent) => {
    //
    //     e.preventDefault();
    //     e.stopPropagation();
    //
    //     const zoomFactor = 1.1;
    //
    //     if (e.deltaY < 0) {
    //         setPixelsPerSecond(prev =>
    //             Math.min(prev * zoomFactor, MAX_SCALE)
    //         );
    //     } else {
    //         setPixelsPerSecond(prev =>
    //             Math.max(prev / zoomFactor, MIN_SCALE)
    //         );
    //     }
    // };

    useEffect(() => {
        draw();
    }, [lanes, pixelsPerSecond]);

    return (
        <div
            ref={containerRef}
            style={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                background: "#111"
            }}
        >
            {lanes.map((lane, laneIndex) => {

                return (
                    <div
                        key={lane.id}
                        style={{
                            display: "flex",
                            height: LANE_HEIGHT,
                            borderBottom: "1px solid #222",
                            overflow: "hidden"
                        }}
                    >
                        {/* Piano Roll Section */}
                        <div
                            style={{
                                width: 150,
                                background: "#181818",
                                borderRight: "1px solid #333",
                                overflow: "hidden",
                                position: "relative",
                                overflowY: "scroll",
                                scrollbarWidth: "none",   // Firefox
                                msOverflowStyle: "none",  // IE/Edge


                            }}
                        >
                            <LaneList lanes={lanes} setLanes={setLanes}/>
                        </div>
                        <div
                            style={{
                                width: 80,
                                background: "#181818",
                                borderRight: "1px solid #333",
                                overflow: "hidden",
                                position: "relative",
                                overflowY: "scroll",
                                scrollbarWidth: "none",   // Firefox
                                msOverflowStyle: "none",  // IE/Edge
                            }}
                        >
                            <LanePianoRoll />
                        </div>



                        {/* Timeline Section */}
                        <div
                            style={{
                                flex: 1,
                                overflowX: "auto",
                                overflowY: "hidden"
                            }}
                        >

                            <canvas
                                ref={laneIndex === 0 ? canvasRef : null}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                style={{ display: "block" }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}