#include <pthread.h>
#include <stdlib.h>
#include "tmr.h"

int main(void) {
    pthread_t threads[2];
    srand(time(0));

    initscr();
    cbreak();
    noecho();
    nodelay(stdscr, TRUE);

    /* Initialize colors */
    start_color();
    init_pair(SPACE_PAIR, COLOR_WHITE, COLOR_BLACK);
    init_pair(OBST_PAIR, COLOR_RED, COLOR_BLACK);
    init_pair(EARTH_PAIR, COLOR_BLUE, COLOR_BLACK);
    init_pair(PLAYER_PAIR, COLOR_GREEN, COLOR_BLACK);

    reset_game();

    /* User interaction should be handled separately from
     * game state, so we're splitting the two threads here */
    pthread_create(&threads[0], NULL, game_thread, NULL);
    pthread_create(&threads[1], NULL, user_thread, NULL);

    /* The game should wait for the user thread to finish */
    pthread_join(threads[1], NULL);

    /* Joining the game thread here is not strictly necessary,
     * but allows the program to wait for the thread to
     * stop and won't be reported as a memory leak. */
    pthread_join(threads[0], NULL);

    /* If we're here, the user is leaving the game */
    endwin();

    if (died) {
        printf("\nYou lost!");
    }

    printf("\nHigh score: %d\n\n", high_score);
    return 0;
}
