export type Phoneme = {
    symbol: string
    type: "vowel" | "consonant"
    start: number
    duration: number
}

export type Props = {
    phonemes: Phoneme[]
}