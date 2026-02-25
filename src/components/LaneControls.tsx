import React from "react";
import type { Lane } from "../models/Lane";

interface Props {
    lanes: Lane[];
    setLanes: React.Dispatch<React.SetStateAction<Lane[]>>;
    selectedLaneId: string;
    setSelectedLaneId: (id: string) => void;
}

export default function LaneControls({
                                         lanes,
                                         setLanes,
                                         selectedLaneId,
                                         setSelectedLaneId
                                     }: Props) {

    const addLane = () => {
        setLanes(prev => [
            ...prev,
            {
                id: "lane_" + (prev.length + 1),
                name: "Lane " + (prev.length + 1),
                muted: false,
                solo: false,
                volume: 1,
                phonemes: []
            }
        ]);
    };

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
        <div style={{
            background:"#1a1a1a",
            padding:10,
            display:"flex",
            gap:10
        }}>

            {lanes.map(lane => (
                <div key={lane.id}
                     style={{
                         padding:10,
                         border: lane.id === selectedLaneId
                             ? "2px solid #00d4ff"
                             : "1px solid #333"
                     }}>

                    <div
                        style={{ cursor:"pointer", fontWeight:"bold" }}
                        onClick={()=>setSelectedLaneId(lane.id)}
                    >
                        {lane.name}
                    </div>

                    <button onClick={()=>toggleMute(lane.id)}>
                        {lane.muted ? "Unmute" : "Mute"}
                    </button>

                    <button onClick={()=>toggleSolo(lane.id)}>
                        {lane.solo ? "Unsolo" : "Solo"}
                    </button>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={lane.volume}
                        onChange={(e)=>
                            updateVolume(lane.id, parseFloat(e.target.value))
                        }
                    />
                </div>
            ))}

            <button onClick={addLane}>+ Add Lane</button>

        </div>
    );
}