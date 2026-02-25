import * as Tone from "tone";

let player: Tone.Oscillator;

export async function initAudio(){
    await Tone.start();
    player = new Tone.Oscillator(220,"sine").toDestination();
    player.start();
}

export function playFreq(freq:number){
    player.frequency.rampTo(freq,0.05);
}