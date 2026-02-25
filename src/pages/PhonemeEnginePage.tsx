import { useState } from "react";
import { parseRomanized, parseBengali } from "../engine/phonemeParser";
import TimelineCanvas from "../components/TimelineCanvas";
import LaneControls from "../components/LaneControls";
import type { Lane } from "../models/Lane";

export default function PhonemeEnginePage() {

    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"roman" | "bengali">("roman");
    const [selectedLaneId, setSelectedLaneId] = useState("lane_1");

    const [lanes, setLanes] = useState<Lane[]>([
        {
            id: "lane_1",
            name: "Lead",
            muted: false,
            solo: false,
            volume: 1,
            phonemes: []
        }
    ]);

    const handleParse = () => {

        const parsed =
            mode === "roman"
                ? parseRomanized(input)
                : parseBengali(input);

        setLanes(prev =>
            prev.map(l =>
                l.id === selectedLaneId
                    ? { ...l, phonemes: parsed }
                    : l
            )
        );
    };

    return (
        <div style={{
            background:"#121212",
            height:"100vh",
            display:"flex",
            flexDirection:"column",
            color:"#fff"
        }}>

            {/* Top Input Bar */}
            <div style={{ padding:20, display:"flex", gap:10 }}>

        <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            style={{ width:400, height:100 }}
        />

                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <button onClick={()=>setMode("roman")}>Roman</button>
                    <button onClick={()=>setMode("bengali")}>Bengali</button>
                    <button onClick={handleParse}>Parse</button>
                </div>
            </div>

            {/* Lane Controls */}
            <LaneControls
                lanes={lanes}
                setLanes={setLanes}
                selectedLaneId={selectedLaneId}
                setSelectedLaneId={setSelectedLaneId}
            />

            {/* Timeline */}
            <TimelineCanvas lanes={lanes} setLanes={setLanes}/>
        </div>
    );
}