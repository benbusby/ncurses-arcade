#include <ncurses.h>
#include <stdlib.h>
#include <string.h>
#include <engine.h>

/**
 * check_input() - Check if user has pressed a key
 *
 * check_input can be used to prompt a user for general confirmation (seen
 * in the main menu) or for parsing game commands (<space> for jump, 'p' for
 * pause, etc).
 *
 * Return: 0/1 representing state of user input
 */
int check_input() {
    int ch = getch();

    if (ch != ERR) {
        ungetch(ch);
        return 1;
    } else {
        return 0;
    }
}

/** clear_map() - Resets all x/y coords in the grid */
void clear_map() {
    int i;
    for (i = 0; i < LINES; i++) {
        mvhline(i, 0, EMPTY, COLS);
    }
}

/** random_col() - Returns a random col between 0 and max columns */
int random_col() {
    return (rand() % (COLS - 1));
}

/** random_line() - Returns a random line between base and max lines */
int random_line(int base) {
    return (rand() % (LINES - base - 1));
}

void write_lines(int start_line, char *lines[]) {
    int i;
    int max_len = 0;
    size_t count = 0;
    while (lines[count] != NULL) {
        int line_len = strlen(lines[count]);
        ++count;
        if (line_len > max_len) {
            max_len = line_len;
        }
    }

    for (i = 0; i < count; i++) {
        char *item = lines[i];
        mvaddstr(LINES / 2 - (start_line - count - i),
                 COLS / 2 - (max_len / 2),
                 item);
    }
}
