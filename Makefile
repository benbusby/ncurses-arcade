CC=gcc
CFLAGS=-Isrc/engine -Isrc/tmr
LDFLAGS=-lncurses -lpthread
SOURCES=$(shell find src -type f -iname '*.c')
OBJECTS=$(foreach file, $(basename $(SOURCES)), $(file).o)

TARGET=ncurses-arcade

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) $^ main.c -o $@ $(LDFLAGS)

clean:
	rm -f $(TARGET) $(OBJECTS)
