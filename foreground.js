function movePlayer() {
    if (keyState[MOVE_RIGHT] || keyState[MOVE_LEFT]) {
        var origX = astronaut.posX;
        var origY = astronaut.posY;

        astronaut.posX += (keyState[MOVE_RIGHT] && astronaut.posX < foreground.x) ? 1 : 0;
        astronaut.posX -= (keyState[MOVE_LEFT] && astronaut.posX > 0) ? 1 : 0;
        if (foreground.map[[origX, origY]] != OBST) {
            foreground.map[[origX, origY]] = VOID;
        } else {
            foreground.map[[astronaut.posX, origY]] = OBST;
        }
    }

    if (keyState[MOVE_UP] && astronaut.posY == playerBase && canJump) {
        jumpUp = 1;
        canJump = false;
    }
}

function calculateJump() {
    if (jumpUp && astronaut.posY <= (playerBase - 6)) {
        jumpUp = 0;
        resetJump = 1;
    } else if (resetJump && astronaut.posY >= playerBase) {
        astronaut.posY = playerBase;
        resetJump = 0;
    }

    var playerX = astronaut.posX;
    var playerY = astronaut.posY;

    laserDelay -= 1;
    if (laserDelay == 0) {
        laserDelay = 5;
    }

    gameOver = (foreground.map[[playerX, playerY]] == OBST) || (foreground.map[[playerX, playerY]] == LASER);

    astronaut.posY = astronaut.posY - (jumpReturn ? jumpUp: 0) + (jumpReturn ? resetJump : 0);
    jumpReturn = !jumpReturn;

    if (!gameOver) {
        gameOver = (foreground.map[[playerX, astronaut.posY]] == OBST) ||
            (foreground.map[[playerX, astronaut.posY]] == LASER);
    }

    foreground.map[[playerX, playerY]] = VOID;
    foreground.map[[astronaut.posX, astronaut.posY]] = PLYR;
}

var foreground = {
    x: Math.floor(640/scl),
    y: Math.floor(360/scl) - 1,
    map: [[]],

    initMap: function() {
        fg2D.font = "15px Lucida Console, Monaco, monospace";
        for (var x = 0; x <= foreground.x; x++) {
            for (var y = 0; y <= foreground.y; y++) {
                if (y > foreground.y - 2) {
                    foreground.map[[x, y]] = MOON;
                    continue;
                }

                foreground.map[[x, y]] = VOID;
            }
        }
    },

    renderMap: function() {
        calculateJump();

        for (var x = 0; x <= foreground.x; x++) {
            var movedLaser = false;
            for (var y = 0; y <= foreground.y; y++) {
                if (gameOver && foreground.map[[x, y]] >= OBST) {
                    foreground.map[[x, y]] = VOID;
                    continue;
                }

                switch (foreground.map[[x, y]]) {
                    case MOON:
                        fg2D.fillStyle = gameOver ? "red" : "#888888"
                        fg2D.fillText('#', x*scl + 5, y*scl + 10);
                        break;
                    case PLYR:
                        fg2D.fillStyle = gameOver ? "red" : "white";
                        fg2D.fillText('@', x*scl + 5, y*scl + 10);
                        break;
                    case OBST:
                        fg2D.fillStyle = "red";
                        fg2D.fillText('n', x*scl + 5, y*scl + 10);
                        if (x != -1) {
                            foreground.map[[x - 1, y]] = foreground.map[[x, y]];
                            foreground.map[[x, y]] = VOID;
                        }
                        break;
                    case LASER:
                        if (movedLaser) {
                            continue;
                        }

                        movedLaser = true;
                        fg2D.fillStyle = "#FF00FF";
                        fg2D.fillText('|', x*scl + 5, y*scl + 10);
                        if (y != foreground.y - 2) {
                            foreground.map[[x, y + 1]] = foreground.map[[x, y]];
                            movedLaser = true;
                            foreground.map[[x, y]] = VOID;
                        } else {
                            foreground.map[[x, y]] = VOID;
                        }
                        break;
                    case ALIEN:
                        fg2D.fillStyle = "green";
                        fg2D.fillText('V', x*scl + 5, y*scl + 10);
                        if (x != -1) {
                            foreground.map[[x - 1, y]] = foreground.map[[x, y]];
                            if (laserDelay == 5) {
                                foreground.map[[x, y + 1]] = LASER;
                            }
                            foreground.map[[x, y]] = VOID;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
};
