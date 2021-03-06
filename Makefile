CC=gcc
CFLAGS=-O3 -pthread -I.
LDFLAGS=-lncurses
DEPS=tmr.h
OBJ=tmr.o main.o
OUT=tiny-moon-runner

%.o: %.c
	$(CC) $(CFLAGS) $< -c -o $@

tmr: $(OBJ)
	$(CC) $(CFLAGS) $^ -o $(OUT) $(LDFLAGS)

clean:
	rm -f *.o
