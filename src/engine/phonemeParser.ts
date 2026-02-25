import { PHONEMES } from "./phonemeDictionary";

export interface ParsedPhoneme {
    id: string;
    symbol: string;
    type: "vowel" | "consonant";
    start: number;
    duration: number;
    pitch: number;
    power: number;
}

let counter = 0;

function createPhoneme(symbol: string, type: string): ParsedPhoneme {
    counter++;

    return {
        id: "ph_" + counter,
        symbol,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        type,
        start: counter * 0.3,
        duration: 0.3,
        pitch: 220,
        power: 1
    };
}

export function parseRomanized(text: string): ParsedPhoneme[] {
    const result: ParsedPhoneme[] = [];
    const lower = text.toLowerCase();

    let i = 0;

    while (i < lower.length) {

        let matched = false;

        for (const ph of PHONEMES.sort((a,b)=>b.symbol.length-a.symbol.length)) {
            if (lower.slice(i, i + ph.symbol.length) === ph.symbol) {
                result.push(createPhoneme(ph.symbol, ph.type));
                i += ph.symbol.length;
                matched = true;
                break;
            }
        }

        if (!matched) i++;
    }

    return result;
}

export function parseBengali(text: string): ParsedPhoneme[] {
    const result: ParsedPhoneme[] = [];

    for (const char of text) {
        const match = PHONEMES.find(p => p.bengali === char);
        if (match) {
            result.push(createPhoneme(match.symbol, match.type));
        }
    }

    return result;
}