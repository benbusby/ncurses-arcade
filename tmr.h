#include <ncurses.h>

#define SCROLL_SPEED 25000

#define SPACE ' '
#define MOON '#'
#define MOON_START 5

#define STAR '*'
#define EARTH 'o'
#define ALIEN 'V'
#define OBST 'X'
#define COIN 'C'

#define JUMP_COUNTER 20

#define MAGIC_NUMBER 17
#define ENEMY_WAIT 1000000

#define HIGH_SCORE_STR "High Score: %d"

#define CHARACTER '@'
#define CHARACTER_START_X 20
#define CHARACTER_START_Y LINES - MOON_START

extern int score, high_score;
extern int jump;
extern int paused;
extern int quit_game;
extern int died;
extern clock_t last_spawn;

int check_input(int ignore);
int random_col();
int random_line();

void spawn_enemy();
void clear_map();
void update_score();
void init_map();
void reset_game();

void *game_thread();
void *user_thread();
