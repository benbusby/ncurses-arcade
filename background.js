function shiftBackground() {
    for (var x = 0; x <= bgMap.x; x++) {
        for (var y = 0; y <= bgMap.y - 2; y++) {
            if (x == bgMap.x) {
                if (!seenEarth && Math.random() > 0.99 && y < bgMap.y - 10) {
                    bgMap.map[[x, y]] = EARTH;
                    seenEarth = true;
                } else if (Math.random() > 0.9) {
                    bgMap.map[[x, y]] = STAR;
                } else {
                    bgMap.map[[x, y]] = VOID;
                }
            } else {
                bgMap.map[[x, y]] = bgMap.map[[x + 1, y]];
            }
        }
    }

    setTimeout(shiftBackground, 150);
}

var bgMap = {
    x: Math.floor(640/scl),
    y: Math.floor(360/scl) - 1,
    map: [[]],

    initMap: function() {
        for (var x = 0; x <= bgMap.x; x++) {
            for (var y = 0; y <= bgMap.y - 2; y++) {
                if (Math.random() > 0.9) {
                    bgMap.map[[x, y]] = STAR;
                } else {
                    bgMap.map[[x, y]] = VOID;
                }
            }
        }
    },

    renderMap: function() {
        bg2D.font = "15px Lucida Console, Monaco, monospace";
        for (var x = 0; x <= bgMap.x; x++) {
            for (var y = 0; y <= bgMap.y; y++) {
                switch (bgMap.map[[x, y]]) {
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
