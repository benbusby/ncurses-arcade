// Values for moving the player up and down during jump
var jumpUp = 0;
var jumpDown = 0;

// Values to determine whether the player can jump, and
// if they're returning back to the ground
var canJump = true;
var jumpReturn = false;

// Establish default player position
var playerBase = 0;
var astronaut = {posX: 0, posY: 0};

/**
 * Controls all movement of the player. Checks for true/false
 * state in the keyState map to either move side-to-side or jump.
 */
function movePlayer() {
    if (keyState[MOVE_RIGHT] || keyState[MOVE_LEFT]) {
        var origX = astronaut.posX;
        var origY = astronaut.posY;

        // Modify x coordinate of the astronaut to move left (-x) or right (+x)
        astronaut.posX += (keyState[MOVE_RIGHT] && astronaut.posX < foreground.x) ? 1 : 0;
        astronaut.posX -= (keyState[MOVE_LEFT] && astronaut.posX > 0) ? 1 : 0;

        // Check for obstacles where the astronaut was and where the astronaut is going to be
        if (foreground.map[[origX, origY]] != OBST) {
            foreground.map[[origX, origY]] = VOID;
        } else {
            foreground.map[[astronaut.posX, origY]] = OBST;
        }
    }

    if (keyState[MOVE_UP] && astronaut.posY == playerBase && canJump) {
        playJumpSound();
        jumpUp = 1;
        canJump = false;
    }
}

/**
 * Calculates the coordinates for the player's jump action.
 */
function calculateJump() {
    // Check for max jump height (base - 6) and return down
    if (jumpUp && astronaut.posY <= (playerBase - 6)) {
        jumpUp = 0;
        jumpDown = 1;
    } else if (jumpDown && astronaut.posY >= playerBase) {
        astronaut.posY = playerBase;
        jumpDown = 0;
    }

    var playerX = astronaut.posX;
    var playerY = astronaut.posY;

    gameOver = (foreground.map[[playerX, playerY]] == OBST) ||
        (foreground.map[[playerX, playerY]] == LASER);

    astronaut.posY = astronaut.posY - (jumpReturn ? jumpUp: 0) + (jumpReturn ? jumpDown : 0);
    jumpReturn = !jumpReturn;

    if (!gameOver) {
        gameOver = (foreground.map[[playerX, astronaut.posY]] == OBST) ||
            (foreground.map[[playerX, astronaut.posY]] == LASER);
    }

    foreground.map[[playerX, playerY]] = VOID;
    foreground.map[[astronaut.posX, astronaut.posY]] = PLYR;
}
