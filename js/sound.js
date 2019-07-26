var context;
var chromeMod = 1;

function initAudio() {
    context = new AudioContext();
    chromeMod = window.chrome ? 10 : 1;
}

/**
 * Plays a note using the built in AudioContext api.
 */
function play(wave, duration, frequency, time, gain) {
    var ctxOsc = context.createOscillator();
    var ctxGain = context.createGain();
    ctxOsc.connect(ctxGain);
    ctxOsc.type = wave;
    ctxGain.connect(context.destination);
    if (gain) {
        ctxGain.gain.value = gain;
    }

    // Play the note for a specific length of time
    ctxGain.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + (duration * chromeMod) + time
    );
    ctxOsc.frequency.value = frequency;

    // Modify start time of note in order to play sequences
    ctxOsc.start(context.currentTime + (time * chromeMod));
}

function playSequence(notes) {
    var duration = 0.1;
    for (var i = 0; i < notes.length; i++) {
        play("sine", duration, notes[i], i * duration, 0.25);
    }
}

function playScoreSound() {
    playSequence([440.0, 554.4, 659.3, 880.0]);
}

function playJumpSound() {
    play("sine", 0.05, 880.0, 0, 0.5);
}

function playGameOver() {
    playSequence([880.0, 659.3, 523.3, 415.3]);
}

