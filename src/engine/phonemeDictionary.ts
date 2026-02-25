export type PhonemeType = "vowel" | "consonant";

export interface PhonemeDef {
    symbol: string;        // Roman internal symbol
    bengali: string;       // Bengali char
    type: PhonemeType;
}

export const PHONEMES: PhonemeDef[] = [

    // Vowels
    { symbol: "a", bengali: "অ", type: "vowel" },
    { symbol: "aa", bengali: "আ", type: "vowel" },
    { symbol: "i", bengali: "ই", type: "vowel" },
    { symbol: "ii", bengali: "ঈ", type: "vowel" },
    { symbol: "u", bengali: "উ", type: "vowel" },
    { symbol: "uu", bengali: "ঊ", type: "vowel" },
    { symbol: "e", bengali: "এ", type: "vowel" },
    { symbol: "oi", bengali: "ঐ", type: "vowel" },
    { symbol: "o", bengali: "ও", type: "vowel" },
    { symbol: "ou", bengali: "ঔ", type: "vowel" },

    // Consonants
    { symbol: "k", bengali: "ক", type: "consonant" },
    { symbol: "kh", bengali: "খ", type: "consonant" },
    { symbol: "g", bengali: "গ", type: "consonant" },
    { symbol: "gh", bengali: "ঘ", type: "consonant" },
    { symbol: "ng", bengali: "ঙ", type: "consonant" },
    { symbol: "ch", bengali: "চ", type: "consonant" },
    { symbol: "j", bengali: "জ", type: "consonant" },
    { symbol: "jh", bengali: "ঝ", type: "consonant" },
    { symbol: "t", bengali: "ত", type: "consonant" },
    { symbol: "th", bengali: "থ", type: "consonant" },
    { symbol: "d", bengali: "দ", type: "consonant" },
    { symbol: "dh", bengali: "ধ", type: "consonant" },
    { symbol: "n", bengali: "ন", type: "consonant" },
    { symbol: "p", bengali: "প", type: "consonant" },
    { symbol: "ph", bengali: "ফ", type: "consonant" },
    { symbol: "b", bengali: "ব", type: "consonant" },
    { symbol: "bh", bengali: "ভ", type: "consonant" },
    { symbol: "m", bengali: "ম", type: "consonant" },
    { symbol: "r", bengali: "র", type: "consonant" },
    { symbol: "l", bengali: "ল", type: "consonant" },
    { symbol: "sh", bengali: "শ", type: "consonant" },
    { symbol: "s", bengali: "স", type: "consonant" },
    { symbol: "h", bengali: "হ", type: "consonant" },
];