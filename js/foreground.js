// Primary foreground object -- handles drawing of
// the player, obstacles, and the moon's surface
var foreground = {
    x: Math.floor(640/scl),
    y: Math.floor(360/scl) - 1,
    map: [[]],

    // Initializes the map with the moon's surface in the bottom
    // two rows
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

    // Renders the foreground objects
    renderMap: function() {
        // Check where the player should be in the foreground
        // if jumping
        calculateJump();

        // Modify delay between lasers
        laserDelay -= 1;
        if (laserDelay == 0) {
            laserDelay = 5;
        }

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
