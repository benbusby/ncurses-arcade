// Canvas elements
var fg2D;
var bg2D;
var fgCan;
var bgCan;
var scl = 15;

// ASCII Draw Codes
const EARTH = -2;
const VOID = -1;
const STAR = 0;
const PLYR = 1;
const MOON = 2;
const OBST = 3;
const ALIEN = 4;
const LASER = 5;

// Movement Keycodes
const keyState = {};
const MOVE_LEFT = 37;
const MOVE_UP = 38;
const MOVE_RIGHT = 39;
const MOVE_DOWN = 40;
const KEY_RESET = 82;

// Game state tracking
var lastKeyCode = 0;
var gameOver = 0;
var jumpUp = 0;
var resetJump = 0;
var bgInterval;
var gameLoopInterval;
var renderInterval;
var obstacleInterval;
var canJump = true;
var jumpReturn = false;
var seenEarth = false;
var laserDelay = 15;

var playerBase = 0;

function startMovement() {
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

// Keyboard controls
document.onkeydown = function (event) {
    if (event.keyCode == KEY_RESET) {
        init();
        return;
    }

    keyState[event.keyCode || event.which] = true;
}

document.onkeyup = function (event) {
    keyState[event.keyCode || event.which] = false;
    if (event.keyCode == MOVE_UP) {
        canJump = true;
    }
}

var foreground = {
    x: Math.floor(640/scl),
    y: Math.floor(360/scl) - 1,
    map: [[]],

    initMap: function() {
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

        fg2D.font = "15px Lucida Console, Monaco, monospace";
        for (var x = 0; x <= foreground.x; x++) {
            var movedLaser = false;
            for (var y = 0; y <= foreground.y; y++) {
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
                        if (gameOver) {
                            foreground.map[[x, y]] = VOID;
                            break;
                        }
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
                        if (gameOver) {
                            foreground.map[[x, y]] = VOID;
                            break;
                        }
                        fg2D.fillStyle = "cyan";
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
                        if (gameOver) {
                            foreground.map[[x, y]] = VOID;
                            break;
                        }
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
                        fg2D.fillStyle = "black";
                        fg2D.fillText(' ', x*scl + 5, y*scl + 10);
                        break;
                }
            }
        }
    }
};

var astronaut = {posX: 0, posY: 0};

window.onload = function() {
    fgCan = document.getElementById('fg');
    fg2D = fgCan.getContext('2d');

    bgCan = document.getElementById('bg');
    bg2D = bgCan.getContext('2d');

    init();
};

function init() {
    playerBase = foreground.y - 2;
    gameOver = 0;
    astronaut.posX = 0;
    astronaut.posY = playerBase;
    bgMap.initMap();
    foreground.initMap();
    update();
    gameLoopInterval = setInterval(startMovement, 50);
    renderInterval = setInterval(update, 50);
    shiftBackground();
    addObstacle();
}

function update() {
    if (gameOver) {
        clearInterval(bgInterval);
        clearInterval(renderInterval);
        clearInterval(gameLoopInterval);
        return;
    }

    render();
}

function render() {
    bg2D.fillStyle = 'black';
    bg2D.fillRect(0, 0, bgCan.width, bgCan.height)
    clearInterval(bgInterval);
    fg2D.clearRect(0, 0, fgCan.width, fgCan.height);
    foreground.renderMap();
    bgMap.renderMap();
}

function addObstacle() {
    if (Math.random() > 0.5) {
        foreground.map[[foreground.x, Math.floor(foreground.y / 2)]] = ALIEN;
    } else {
        for (var y = foreground.y - (3 + Math.ceil(Math.random() * 2)); y <= foreground.y - 2; y++) {
            foreground.map[[foreground.x, y]] = OBST;
        }
    }

    setTimeout(addObstacle, Math.random() * 2000);
}
