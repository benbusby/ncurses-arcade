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
var astronaut = {posX: 0, posY: 0};

// User input controls
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
    gameLoopInterval = setInterval(movePlayer, 50);
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
