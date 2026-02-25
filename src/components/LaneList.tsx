import React from "react";
import type { Lane } from "../models/Lane";

interface Props {
    lanes: Lane[];
    setLanes: React.Dispatch<React.SetStateAction<Lane[]>>;
}

export default function LaneList({ lanes, setLanes }: Props) {

    const toggleMute = (id: string) => {
        setLanes(prev =>
            prev.map(l =>
                l.id === id ? { ...l, muted: !l.muted } : l
            )
        );
    };

    const toggleSolo = (id: string) => {
        setLanes(prev =>
            prev.map(l =>
                l.id === id ? { ...l, solo: !l.solo } : l
            )
        );
    };

    const updateVolume = (id: string, value: number) => {
        setLanes(prev =>
            prev.map(l =>
                l.id === id ? { ...l, volume: value } : l
            )
        );
    };

    return (
        <div>

            {lanes.map(lane => (

                <div
                    key={lane.id}
                    style={{
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 10,
                        borderBottom: "1px solid #333"
                    }}
                >

                    <div>
                        <div>{lane.name}</div>

                        <div style={{ display: "flex", gap: 6 }}>

                            <button
                                onClick={() => toggleMute(lane.id)}
                                style={{
                                    background: lane.muted ? "#ff5555" : "#333",
                                    color: "#fff",
                                    width: 30
                                }}
                            >
                                M
                            </button>

                            <button
                                onClick={() => toggleSolo(lane.id)}
                                style={{
                                    background: lane.solo ? "#55ff55" : "#333",
                                    color: "#fff",
                                    width: 30
                                }}
                            >
                                S
                            </button>

                        </div>
                    </div>

                    {/* Volume Knob */}
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={lane.volume}
                        onChange={e =>
                            updateVolume(lane.id, parseFloat(e.target.value))
                        }
                        style={{
                            transform: "rotate(-90deg)",
                            width: 60
                        }}
                    />

                </div>

            ))}

        </div>
    );
}