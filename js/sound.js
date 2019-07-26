var context;
var isChrome = 0;

function initAudio() {
    context = new AudioContext();
    isChrome = window.chrome ? 1 : 0;
}

/**
 * Plays a note using the built in AudioContext api.
 */
function play(wave, duration, frequency, time, gain, size) {
    var ctxOsc = context.createOscillator();
    var ctxGain = context.createGain();
    ctxOsc.connect(ctxGain);
    ctxOsc.type = wave;
    ctxGain.connect(context.destination);

    if (gain) {
        ctxGain.gain.value = gain;
    }

    ctxOsc.frequency.value = frequency;

    // Play the note for a specific length of time
    if (!isChrome) {
        ctxGain.gain.exponentialRampToValueAtTime(
            0.00001, context.currentTime +
            duration +
            (time + (isChrome * size))
        );

        // Modify start time of note in order to play sequences
        ctxOsc.start(context.currentTime + time);
    } else {
        ctxOsc.start(context.currentTime + time);
        setTimeout(function() {
            ctxOsc.stop();
        }, 150 * (size > 1 ? size : 0.25));
    }
}

function playSequence(notes) {
    var duration = 0.1;
    for (var i = 0; i < notes.length; i++) {
        play("sine", duration, notes[i], i * duration, 0.25, notes.length);
    }
}

function playScoreSound() {
    playSequence([440.0, 554.4, 659.3, 880.0]);
}

function playJumpSound() {
    play("sine", 0.05, 880.0, 0, 0.5, 1);
}

function playGameOver() {
    playSequence([880.0, 659.3, 523.3, 415.3]);
}

