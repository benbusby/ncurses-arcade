var c;
var cc;
var scl = 15;

// ASCII Draw Codes
const VOID = -1;
const STAR = 0;
const NEIL = 1;
const MOON = 3;
const OBST = 4;
const EARTH = -2;

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
var gameLoopInterval;
var renderInterval;
var canJump = true;
var jumpReturn = false;
var seenEarth = false;

var playerBase = 0;

function startMovement() {
    if (keyState[MOVE_RIGHT] || keyState[MOVE_LEFT]) {
        var origX = astronaut.posX;
        var origY = astronaut.posY;
        if (map.map[[origX, origY]] == OBST) {
            return;
        }
        map.map[[origX, origY]] = initialMap[[origX, origY]];
        astronaut.posX += (keyState[MOVE_RIGHT] && astronaut.posX < map.x) ? 1 : 0;
        astronaut.posX -= (keyState[MOVE_LEFT] && astronaut.posX > 0) ? 1 : 0;
    }

    if (keyState[MOVE_UP] && astronaut.posY == playerBase && canJump) {
        jumpUp = 1;
        canJump = false;
    }
}

function gameLoop() {
    gameLoopInterval = setInterval(startMovement, 50);
}

function shiftBackground() {
    for (var x = 0; x <= map.x; x++) {
        for (var y = 0; y <= map.y - 5; y++) {
            if (map.map[[x, y]] == OBST) {
                continue;
            }

            if (map.map[[x, y]] == NEIL) {
                map.map[[x - 1, y]] = initialMap[[x, y]];
                initialMap[[x, y]] = map.map[[x, y]];
            }

            if (x == map.x) {
                if (!seenEarth && Math.random() > 0.99 && y < map.y - 10) {
                    map.map[[x, y]] = EARTH;
                    seenEarth = true;
                } else if (Math.random() > 0.9) {
                    map.map[[x, y]] = STAR;
                    initialMap[[x, y]] = STAR;
                } else {
                    map.map[[x, y]] = VOID;
                    initialMap[[x, y]] = VOID;
                }
            } else if (map.map[[x + 1, y]] <= STAR && initialMap[[x + 1, y]] <= STAR) {
                map.map[[x, y]] = map.map[[x + 1, y]];
                initialMap[[x, y]] = initialMap[[x + 1, y]];
            }
        }
    }

    setTimeout(shiftBackground, 100);
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

var initialMap = [[]];
var map = {
    x: Math.floor(640/scl),
    y: Math.floor(360/scl) - 1,
    map: [[]],

    initMap: function() {
        for (var x = 0; x <= map.x; x++) {
            for (var y = 0; y <= map.y; y++) {
                if (y > map.y - 2) {
                    map.map[[x, y]] = MOON;
                    initialMap[[x, y]] = MOON;
                    continue;
                }

                if (y > map.y - 5) {
                    continue;
                }

                if (Math.random() > 0.9) {
                    map.map[[x, y]] = STAR;
                    initialMap[[x, y]] = STAR;
                } else {
                    map.map[[x, y]] = VOID;
                    initialMap[[x, y]] = VOID;
                }
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

        astronaut.posY = astronaut.posY - (jumpReturn ? jumpUp: 0) + (jumpReturn ? resetJump : 0);
        //astronaut.posY = astronaut.posY - jumpUp + resetJump;
        jumpReturn = !jumpReturn;

        gameOver = (map.map[[playerX, playerY]] == OBST || map.map[[playerX, astronaut.posY]] == OBST)

        if (jumpUp || resetJump) {
            map.map[[playerX, playerY]] = initialMap[[playerX, playerY]];
        }

        map.map[[astronaut.posX, astronaut.posY]] = NEIL;

        cc.font = "15px Lucida Console, Monaco, monospace";
        for (var x = 0; x <= map.x; x++) {
            for (var y = 0; y <= map.y; y++) {
                switch (map.map[[x, y]]) {
                    case VOID:
                        cc.fillStyle = gameOver ? "red" : "#000000";
                        cc.fillText(' ', x*scl + 5, y*scl + 10);
                        break;
                    case MOON:
                        cc.fillStyle = gameOver ? "red" : "#444444"
                        cc.fillText('#', x*scl + 5, y*scl + 10);
                        break;
                    case STAR:
                        cc.fillStyle = gameOver ? "red" : "#aaaaaa";
                        cc.fillText(Math.random() > 0.9 ? '*' : '.', x*scl + 5, y*scl + 10);
                        break;
                    case NEIL:
                        cc.fillStyle = gameOver ? "red" : "white";
                        cc.fillText('@', x*scl + 5, y*scl + 10);
                        break;
                    case EARTH:
                        cc.fillStyle = gameOver ? "red" : "blue";
                        cc.fillText('o', x*scl + 5, y*scl + 10);
                        break;
                    case OBST:
                        if (gameOver) {
                            map.map[[x, y]] = VOID;
                            break;
                        }
                        cc.fillStyle = "red";
                        cc.fillText('n', x*scl + 5, y*scl + 10);
                        if (x != -1) {
                            map.map[[x - 1, y]] = map.map[[x, y]];
                            map.map[[x, y]] = initialMap[[x, y]];
                        }
                        break;
                }
            }
        }
    }
};

var astronaut = {posX: 0, posY: 0};

window.onload = function() {
    c = document.getElementById('gc');
    cc = c.getContext('2d');

    init();
};

function init() {
    playerBase = map.y - 2;
    gameOver = 0;
    astronaut.posX = 0;
    astronaut.posY = playerBase;
    map.initMap();
    update();
    gameLoop();
    shiftBackground();
    renderInterval = setInterval(update, 50);
    addObstacle();
}

function update() {
    if (gameOver) {
        clearInterval(renderInterval);
        clearInterval(gameLoopInterval);
        return;
    }

    render();
}

function render() {
    cc.fillStyle = 'black';
    cc.fillRect(0, 0, c.width, c.height);
    map.renderMap();
}

function addObstacle() {
    for (var y = map.y - (3 + Math.ceil(Math.random() * 2)); y <= map.y - 2; y++) {
        map.map[[map.x, y]] = OBST;
    }

    setTimeout(addObstacle, Math.random() * 2000);
}
