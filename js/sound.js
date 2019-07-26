var context;

function initAudio() {
    context = new AudioContext();
}

/**
 * Plays any sequence of notes using the built in AudioContext api.
 */
function play(notes, duration, gain) {
    var osc = context.createOscillator();

    // Change oscillator frequency to change after a specified duration
    osc.frequency.value = notes[0];
    for (var i = 1; i < notes.length; i++) {
        osc.frequency.setValueAtTime(
            notes[i],
            context.currentTime + (i * duration)
        );
    }

    osc.start();

    // Create gain node to connect the oscillator to. This is used to ramp
    // down volume and avoid the clicking noise at the end of each note
    var ctxGain = context.createGain();
    ctxGain.gain.value = gain;
    ctxGain.connect(context.destination);
    osc.connect(ctxGain);

    // Calculate total time (# of notes * duration) and ensure the sequence
    // is stopped properly
    var totalTime = context.currentTime + (notes.length * duration);
    ctxGain.gain.setTargetAtTime(0, totalTime, 0.015);
    osc.stop(totalTime + 0.015);
}

function playScoreSound() {
    play([440.0, 554.4, 659.3, 880.0], 0.1, 0.5);
}

function playJumpSound() {
    play([880.0], 0.05, 0.5);
}

function playGameOver() {
    play([880.0, 659.3, 523.3, 415.3], 0.1, 0.5);
}

