import type {ParsedPhoneme} from "../engine/phonemeParser";

export interface Lane {
    id: string;
    name: string;
    muted: boolean;
    solo: boolean;
    volume: number;
    phonemes: ParsedPhoneme[];
}
