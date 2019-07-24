function shiftBackground() {
    //if (gameOver) {
        //return;
    //}
    for (var x = 0; x <= background.x; x++) {
        for (var y = 0; y <= background.y - 2; y++) {
            if (x == background.x) {
                if (!seenEarth && Math.random() > 0.99 && y < background.y - 10) {
                    background.map[[x, y]] = EARTH;
                    seenEarth = true;
                } else if (Math.random() > 0.9) {
                    background.map[[x, y]] = STAR;
                } else {
                    background.map[[x, y]] = VOID;
                }
            } else {
                background.map[[x, y]] = background.map[[x + 1, y]];
            }
        }
    }

    setTimeout(shiftBackground, 150);
}

var background = {
    x: Math.floor(640/scl),
    y: Math.floor(360/scl) - 1,
    map: [[]],

    initMap: function() {
        for (var x = 0; x <= background.x; x++) {
            for (var y = 0; y <= background.y - 2; y++) {
                if (Math.random() > 0.9) {
                    background.map[[x, y]] = STAR;
                } else {
                    background.map[[x, y]] = VOID;
                }
            }
        }
    },

    renderMap: function() {
        bg2D.font = "15px Lucida Console, Monaco, monospace";
        for (var x = 0; x <= background.x; x++) {
            for (var y = 0; y <= background.y; y++) {
                switch (background.map[[x, y]]) {
                    case VOID:
                        bg2D.fillStyle = gameOver ? "red" : "#000000";
                        bg2D.fillText(' ', x*scl + 5, y*scl + 10);
                        break;
                    case STAR:
                        bg2D.fillStyle = gameOver ? "red" : "#dddddd";
                        bg2D.fillText(Math.random() > 0.9 ? '*' : '.', x*scl + 5, y*scl + 10);
                        break;
                    case EARTH:
                        bg2D.fillStyle = gameOver ? "red" : "blue";
                        bg2D.fillText('o', x*scl + 5, y*scl + 10);
                        break;
                }
            }
        }
    }
};
