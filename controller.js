var c;
var cc;
var scl = 15;

// ASCII Draw Codes
const VOID = -1;
const SPACE = 0;
const EARTH = 1;
const WATER = 2;
const MOON = 3;
const OBSTACLE = 4;

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

var playerBase = 0;

function startMovement() {
    if (keyState[MOVE_RIGHT] || keyState[MOVE_LEFT]) {
        var origX = astronaut.posX;
        var origY = astronaut.posY;
        map.map[[origX, origY]] = initialMap[[origX, origY]];
        astronaut.posX += (keyState[MOVE_RIGHT] && astronaut.posX < map.x) ? 1 : 0;
        astronaut.posX -= (keyState[MOVE_LEFT] && astronaut.posX > 0) ? 1 : 0;
    }

    if (keyState[MOVE_UP] && astronaut.posY == playerBase) {
        jumpUp = 1;
    }
}

function gameLoop() {
    gameLoopInterval = setInterval(startMovement, 50);
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
}

var initialMap = [[]];
var map = {
    x: Math.floor(640/scl),
    y: Math.floor(360/scl) - 1,
    map: [[]],

    initMap: function() {
        console.log(map.x + ", " + map.y);
        for (var x = 0; x <= map.x; x++) {
            for (var y = 0; y <= map.y; y++) {
                if (y > map.y - 2) {
                    map.map[[x, y]] = OBSTACLE;
                    initialMap[[x, y]] = OBSTACLE;
                    continue;
                }

                if (Math.random() > 0.9) {
                    map.map[[x, y]] = SPACE;
                    initialMap[[x, y]] = SPACE;
                } else {
                    map.map[[x, y]] = VOID;
                    initialMap[[x, y]] = VOID;
                }
            }
        }
    },

    renderMap: function() {
        if (jumpUp && astronaut.posY <= (playerBase - 8)) {
            jumpUp = 0;
            resetJump = 1;
        } else if (resetJump && astronaut.posY >= playerBase) {
            astronaut.posY = playerBase;
            resetJump = 0;
        }

        var playerX = astronaut.posX;
        var playerY = astronaut.posY;

        astronaut.posY = astronaut.posY - jumpUp + resetJump;

        if (map.map[[playerX, playerY]] == OBSTACLE) {
            gameOver = 1;
        }

        map.map[[25, 47]] = OBSTACLE;
        if (jumpUp || resetJump) {
            map.map[[playerX, playerY]] = initialMap[[playerX, playerY]];
        }

        map.map[[astronaut.posX, astronaut.posY]] = EARTH;

        cc.font = "15px Arial";
        for (var x = 0; x <= map.x; x++) {
            for (var y = 0; y <= map.y; y++) {
                switch (map.map[[x, y]]) {
                    case VOID:
                        cc.fillStyle = gameOver ? "red" : "#000000";
                        cc.fillText(' ', x*scl + 5, y*scl + 10);
                        break;
                    case OBSTACLE:
                        cc.fillStyle = gameOver ? "red" : "#444444"
                        cc.fillText('#', x*scl + 5, y*scl + 10);
                        break;
                    case SPACE:
                        cc.fillStyle = gameOver ? "red" : "#aaaaaa";
                        cc.fillText('.', x*scl + 5, y*scl + 10);
                        break;
                    case EARTH:
                        cc.fillStyle = gameOver ? "red" : "white";
                        cc.fillText('@', x*scl + 5, y*scl + 10);
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
    renderInterval = setInterval(update, 50);
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

}
