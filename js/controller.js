// Canvas elements
var fg2D;
var bg2D;
var fgCan;
var bgCan;
var scl = 15;

// ASCII Draw Codes
var EARTH = -2;
var VOID = -1;
var STAR = 0;
var PLYR = 1;
var MOON = 2;
var OBST = 3;
var ALIEN = 4;
var LASER = 5;

// Movement Keycodes
var keyState = {};
var MOVE_LEFT = 37;
var MOVE_UP = 38;
var MOVE_RIGHT = 39;
var MOVE_DOWN = 40;
var KEY_RESET = 82;

// Game state tracking
var lastKeyCode = 0;
var gameOver = 0;
var bgInterval;
var seenEarth = false;
var canStart = false;

// Delay between lasers fired by the alien ships
var laserDelay = 15;

// Game object creation and rendering intervals
var gameLoopInterval;
var renderInterval;
var obstacleInterval;


// User input controls
document.onkeydown = function (event) {
    if (canStart) {
        canStart = false;
        startGame();
        playScoreSound();
        return;
    }

    if (event.keyCode == KEY_RESET) {
        foreground.map = [[]];
        background.map = [[]];
        gameOver = 0;
        jumpUp = 0;
        currentScore = 0;
        clearInterval(bgInterval);
        clearInterval(renderInterval);
        clearInterval(gameLoopInterval);
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
    canStart = true;
};

function startGame() {
    fgCan = document.getElementById('fg');
    fg2D = fgCan.getContext('2d');

    bgCan = document.getElementById('bg');
    bg2D = bgCan.getContext('2d');

    init();
    initAudio();
    shiftBackground();
    addObstacle();
}

function init() {
    playerBase = foreground.y - 2;
    gameOver = 0;
    astronaut.posX = 0;
    astronaut.posY = playerBase;
    background.initMap();
    foreground.initMap();
    console.log(background.x);
    update();
    gameLoopInterval = setInterval(movePlayer, 50);
    renderInterval = setInterval(update, 50);
}

function update() {
    if (gameOver) {
        playGameOver();
        clearInterval(bgInterval);
        clearInterval(renderInterval);
        clearInterval(gameLoopInterval);
        finalizeScore();
        return;
    }

    updateScore();
    render();
}

function render() {
    bg2D.fillStyle = 'black';
    bg2D.fillRect(0, 0, bgCan.width, bgCan.height)
    fg2D.clearRect(0, 0, fgCan.width, fgCan.height);
    foreground.renderMap();
    background.renderMap();
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
