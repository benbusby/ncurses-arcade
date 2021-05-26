# Ncurses Arcade

A collection of command line games, built with ncurses.

## Install

- Command Line
    - Requires ncurses
    ```
    git clone https://github.com/benbusby/ncurses-arcade.git
    cd ncurses-arcade
    make
    ./ncurses-arcade
    ```
- Web (tiny-moon-runner only)
    ```
    git clone https://github.com/benbusby/ncurses-arcade.git
    cd ncurses-arcade
    git checkout web
    open index.html
    ```

## Games
### Tiny Moon Runner
A small ASCII endless runner, originally created for the [Apollo 11 GC Game Jam](https://itch.io/jam/agc-jam). Also available as an iframe-able browser game in the `web` branch.

The theme of the game jam was to create a simple game that took up less than 32 kilobytes of memory (the capacity of the Apollo 11 guidance computer).

The visuals in the game are accomplished using a 2D matrix of characters that are updated on a regular interval to achieve a constant "framerate", with the characters moved between rows and colums of the matrix to simulate motion:

![web-gif](./img/demo.gif)

Also available via browser on [Itch.io](https://benbusby.itch.io/tiny-moon-runner)
