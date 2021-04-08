#include <pthread.h>
#include <stdlib.h>
#include <ncurses.h>
#include "engine.h"
#include "tmr.h"
#include "main.h"

/**
 * load_game() - Initializes a game into a playable state
 * @game_thread: The game's "background" thread (state changes)
 * @user_thread: The game's "foreground" thread (user input)
 */
void load_game(void* game_thread, void* user_thread) {
    pthread_t threads[2];

    /* User interaction should be handled separately from game
     * state, so we're splitting the two threads here */
    pthread_create(&threads[0], NULL, game_thread, NULL);
    pthread_create(&threads[1], NULL, user_thread, NULL);

    /* The game should wait for the user thread (1) to finish */
    pthread_join(threads[1], NULL);

    /* Joining the game thread (0) here is not strictly necessary,
     * but allows the program to wait for the thread to stop, and
     * won't be reported as a memory leak. */
    pthread_join(threads[0], NULL);
}

void arcade_menu() {
    clear_map();
    char *items[9] = {
        "+================+",
        "| Ncurses Arcade |",
        "+================+",
        "",
        "Select a game or exit",
        "",
        "[0] Exit",
        "[1] Tiny Moon Runner",
        NULL
    };
    write_lines(12, items);

    int valid = 0;

    /* Wait for a valid user choice */
    while (!valid) {
        int choice = getch();
        if (choice == '0') {
            return;
        } else {
            if (choice == '1') {
                valid = 1;
                tiny_moon_runner();
            }
        }
    }
}

/**
 * tiny_moon_runner() - Starts "Tiny Moon Runner" (endless runner game)
 */
void tiny_moon_runner() {
    init_tmr();
    load_game(tmr_game_thread, tmr_user_thread);

    /* If we're here, the user has exited the game */
    arcade_menu();
}

int main() {
    srand(time(0));

    /* Initialize ncurses state for all games */
    initscr();
    cbreak();
    noecho();
    nodelay(stdscr, TRUE);
    curs_set(0);
    start_color();

    /* Open menu to pick game */
    arcade_menu();

    /* If we're here, the user is leaving the arcade */
    endwin();

    /* FIXME: Need some other exit screen to support multiple games */
    /*printf("\nHigh score: %d\n\n", high_score);*/
    return 0;
}
