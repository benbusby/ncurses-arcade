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

#define SPACE_PAIR     1
#define OBST_PAIR      2
#define PLAYER_PAIR    3

#define JUMP_COUNTER 20

#define MAGIC_NUMBER 17
#define ENEMY_WAIT 1000000

#define HIGH_SCORE_STR "High Score: %d"

#define PLAYER '@'
#define PLAYER_START_X 20
#define PLAYER_START_Y LINES - MOON_START

extern int score, high_score;
extern int jump;
extern int paused;
extern int quit_game;
extern int died;
extern clock_t last_spawn;

int check_input(int ignore);
int random_col();
int random_line();

void move_char(int y, int x, int ch);
void spawn_enemy();
void clear_map();
void update_score();
void init_map();
void reset_game();

void *game_thread();
void *user_thread();
