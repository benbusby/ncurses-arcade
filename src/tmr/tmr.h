#include <ncurses.h>

/* Game pieces */
#define SPACE  ' '
#define MOON   '#'
#define STAR   '*'
#define EARTH  'O'
#define ALIEN  'V'
#define OBST   'X'
#define COIN   'C'
#define PLAYER '@'

/* Ncurses color pairs */
#define SPACE_PAIR  1
#define OBST_PAIR   2
#define EARTH_PAIR  3
#define PLAYER_PAIR 4

/* Game state values */
#define SCROLL_SPEED 25000
#define JUMP_COUNTER 20
#define MAGIC_NUMBER 17
#define ENEMY_WAIT   1000000

/* UI */
#define HIGH_SCORE_STR "High Score: %d"

/* Position values */
#define EARTH_START_X COLS / 2
#define EARTH_START_Y LINES / 2
#define MOON_START 5
#define PLAYER_START_X 20
#define PLAYER_START_Y LINES - MOON_START

extern int score, high_score;
extern int jump;
extern int paused;
extern int quit_game;
extern int died;
extern clock_t last_spawn;

int random_col();
int random_line();

void move_char(int y, int x, int ch);
void spawn_enemy();
void clear_map();
void update_score();
void init_map();
void init_tmr();
void reset_tmr();

void *tmr_game_thread();
void *tmr_user_thread();
