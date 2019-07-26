var currentScore = 0;
var highScore = 0;
var scoreboard = document.getElementById("current-score");
var flashScore = {val: 0, time: 0};

/**
 * Sets the new high score, if current is higher.
 * Also stops flashing the score if a milestone had just been
 * reached.
 */
function finalizeScore() {
    flashScore.time = 0;
    scoreboard.textContent = currentScore;
    scoreboard.style.visibility = "initial";

    if (currentScore > highScore) {
        highScore = currentScore;
        document.getElementById("high-score").textContent = highScore;
    }
}

/**
 * Updates the score, playing a tune and flashing the score
 * for every 100 points earned.
 */
function updateScore() {
    currentScore += 1;
    if (currentScore % 100 == 0) {
        playScoreSound();
        flashScore.val = currentScore;
        scoreboard.textContent = flashScore.val;
        flashScore.time = 25;
    }

    if (flashScore.time > 0) {
        if (flashScore.time > 0 && flashScore.time % 5 == 0) {
            scoreboard.style.visibility = "hidden";
        } else {
            scoreboard.style.visibility = "initial";
        }
        flashScore.time--;
    } else {
        scoreboard.textContent = currentScore;
    }
}
