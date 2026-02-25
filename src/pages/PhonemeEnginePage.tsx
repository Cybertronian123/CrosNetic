import { useState } from "react";
import TimelineCanvas from "../components/TimelineCanvas";
import { parseRomanized, parseBengali } from "../engine/phonemeParser";

export default function PhonemeEnginePage() {

    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"roman" | "bengali">("roman");
    const [phonemes, setPhonemes] = useState<any[]>([]);

    const handleParse = () => {
        const parsed =
            mode === "roman"
                ? parseRomanized(input)
                : parseBengali(input);

        setPhonemes(parsed);
    };

    return (
        <div style={{ background:"#121212", height:"100vh", color:"#fff" }}>

            <div style={{ padding:20 }}>
        <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            style={{ width:"400px", height:"100px" }}
        />

                <button onClick={()=>setMode("roman")}>Roman</button>
                <button onClick={()=>setMode("bengali")}>Bengali</button>
                <button onClick={handleParse}>Parse</button>
            </div>

            <TimelineCanvas phonemes={phonemes}/>
        </div>
    );
}