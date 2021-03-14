#include <ncurses.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include "tmr.h"

int score = 0, high_score = 0;
int jump = 0;
int paused = 1;
int quit_game = 0;
int died = 0;
clock_t last_spawn = 0;

/**
 * check_input() - Check if user has pressed a key
 * @reset: Flag to reset the specific character for consuming elsewhere
 *
 * check_input can be used to prompt a user for general confirmation (seen
 * in the main menu) or for parsing game commands (<space> for jump, 'p' for
 * pause, etc).
 *
 * Return: 0/1 representing state of user input
 */
int check_input(int reset) {
    int ch = getch();

    if (ch != ERR) {
        if (reset) {
            ungetch(ch);
        }
        return 1;
    } else {
        return 0;
    }
}

/** reset_game() - Resets the game to a non-playable state
 *
 * This is called on every new game, and can additionally be used to restart
 * the game upon death, or if the player wants to pause and restart.
 */
void reset_game() {
    clear_map();

    score = 0, jump = 0;

    mvaddstr(LINES / 2 - 5, COLS / 2 - 6, "Moon Runner");
    mvaddstr(LINES / 2 - 4, COLS / 2 - 8, "<Space> to jump");
    mvaddstr(LINES / 2 - 3, COLS / 2 - 6, "'q' to quit");
    mvaddstr(LINES / 2 - 2, COLS / 2 - 6, "'p' to pause");
    mvaddstr(LINES / 2 - 1, COLS / 2 - 11, "Press any key to begin");
    if (high_score > 0) {
        /* We're not sure how much memory we need for the high score
         * string, so we use snprintf to get the necessary size of the
         * buffer */
        ssize_t buf_size = snprintf(NULL, 0, HIGH_SCORE_STR, high_score);
        char score_str[buf_size + 1];
        snprintf(score_str, buf_size + 1, HIGH_SCORE_STR, high_score);
        mvaddstr(LINES / 2, COLS / 2 - (buf_size / 2), score_str);
    }

    while (!quit_game) {
        /* Wait for user input to start game */
        if (check_input(0)) {
            paused = 0;
            init_map();
            break;
        }
    }
}

/** game_thread() - Handle all game state changes
 *
 * The game thread loop handles movement of all characters on the screen. Stars
 * are looped once they leave the player's screen, but all other characters are
 * ignored.
 *
 * The thread also handles enemy spawning, character movement, and scoring.
 */
void *game_thread() {
    while (!quit_game) {
        int x, y;
        int character_x, character_y;
        usleep(SCROLL_SPEED);

        if (paused) {
            continue;
        }

        /* Spawn enemies randomly, but not too frequently */
        if (!(rand() % MAGIC_NUMBER) &&
            ((double) clock() - (double) last_spawn) > ENEMY_WAIT) {
            spawn_enemy();
        }

        for (x = 0; x < COLS; x++) {
            for (y = LINES - MOON_START; y >= 0; y--) {
                int nextch = mvinch(y, x);
                if ((nextch & A_CHARTEXT) == PLAYER) {
                    character_x = x;
                    character_y = y;
                } else {
                    if ((mvinch(y, x - 1) & A_CHARTEXT) == PLAYER) {
                        /* Check if player has hit an obstacle */
                        if ((nextch & A_CHARTEXT) == OBST) {
                            quit_game = 1;
                            died = 1;
                        }
                        move_char(y, x - 2, nextch);
                    } else {
                        move_char(y, x - 1, nextch);
                    }

                    if (x - 1 <= 0) {
                        if ((nextch & A_CHARTEXT) == OBST) {
                            move_char(y, x, SPACE);
                        } else {
                            move_char(y, COLS - 1, nextch);
                        }
                    }
                }
            }
        }

        /* Handle jumping:
         * if > 0, the player is jumping, otherwise they are either
         * descending or are still. */
        if (jump > 0) {
            /* A regular increment would be too fast. Here we slow
             * it down by restricting movement to every 5 "frames". */
            if (!(jump % 5)) {
                move_char(character_y - 1, character_x, PLAYER);
                move_char(character_y, character_x, SPACE);
            }
            jump--;
        }

        /* Check if player character needs to begin descending */
        if (jump <= 0 && character_y < PLAYER_START_Y) {
            /* Same logic as before, but for the opposite direction */
            if (!(jump % 5)) {
                move_char(character_y + 1, character_x, PLAYER);
                move_char(character_y, character_x, SPACE);
            }

            jump--;
        } else if (jump <= 0 && character_y == PLAYER_START_Y) {
            jump = 0;
        }

        update_score();
    }

    return NULL;
}

/** user_thread() - Handle all user input
 *
 * User input for jumping, pausing, etc is handled in this loop. Each input
 * modifies the global game state, with changes handled in the game thread.
 */
void *user_thread() {
    while (!quit_game) {
        if (check_input(1)) {
            switch (getch()) {
                case ' ':
                    jump = jump == 0 ? JUMP_COUNTER : jump;
                    break;
                case 'p':
                    paused = !paused;
                    break;
                case 'r':
                    if (paused) {
                        reset_game();
                    }
                case 'q':
                    quit_game = 1;
                    break;
                default:
                    break;
            }
            refresh();
        }
    }

    return NULL;
}

/**
 * move_char() - Move a character to a new position
 * @y: New y pos
 * @x: New x pos
 * @ch: The character to move
 *
 * This basically overloads mvaddch, but with the added step of setting and
 * unsetting the appropriate color per character every time.
 */
void move_char(int y, int x, int ch) {
    /* TODO: Finish + clean this up */
    int cpair = SPACE_PAIR;
    if (ch == OBST) {
        cpair = OBST_PAIR;
    } else if (ch == PLAYER) {
        cpair = PLAYER_PAIR;
    } else if (ch == EARTH) {
        cpair = EARTH_PAIR;
    }
    attron(COLOR_PAIR(cpair));
    mvaddch(y, x, ch);
    attroff(COLOR_PAIR(cpair));
}

/** update_score() - Increments global score counter and updates high score */
void update_score() {
    /* Add score (and high score if applicable) */
    score += 1;
    high_score = score > high_score ? score : high_score;

    /* Update UI */
    ssize_t buf_size = snprintf(NULL, 0, " -- Score: %d -- ", score);
    char score_str[buf_size + 1];
    snprintf(score_str, buf_size + 1, " -- Score: %d -- ", score);
    mvaddstr(LINES - 1, 1, score_str);
}

/** spawn_enemy() - Creates a new (temporary) enemy/obstacle */
void spawn_enemy() {
    move_char(LINES - MOON_START, COLS - 2, OBST);
    move_char(LINES - MOON_START - 1, COLS - 2, OBST);
    if (rand() & 1) {
        move_char(LINES - MOON_START - 2, COLS - 2, OBST);
    }

    last_spawn = clock();
}

/** init_map() - Initializes map to a new, semi-random state
 *
 * The map will always have the same placement of the "moon" and player
 * starting point, but will have random star placement.
 */
void init_map() {
    int x, y;
    clear_map();

    for (x = 0; x < LINES; x++) {
        move_char(x, random_col(), STAR);
    }

    for (y = LINES; y > LINES - MOON_START; y--) {
        mvhline(y, 0, MOON, COLS);
    }

    move_char(EARTH_START_Y, EARTH_START_X, EARTH);
    move_char(LINES - MOON_START, PLAYER_START_X, PLAYER);
    update_score();
    spawn_enemy();
}

/** clear_map() - Resets all x/y coords in the grid to the empty SPACE char */
void clear_map() {
    int i;
    for (i = 0; i < LINES; i++) {
        mvhline(i, 0, SPACE, COLS);
    }
}

/** random_col() - Returns a random col between 0 and max columns */
int random_col() {
    return (rand() % (COLS - 1));
}

/** random_line() - Returns a random line between 0 and max lines */
int random_line() {
    return (rand() % (LINES - MOON_START - 1));
}
