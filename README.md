# Tiny Moon Runner
A small ASCII endless runner, created for the [Apollo 11 GC Game Jam](https://itch.io/jam/agc-jam). Available as a game for both the command line and the web.

The theme of the game jam was to create a simple game that took up less than 32 kilobytes of memory (the capacity of the Apollo 11 guidance computer).

The visuals in the game are accomplished using a 2D matrix of characters that are updated on a regular interval to achieve a constant "framerate", with the characters moved between rows and colums of the matrix to simulate motion:

### Command Line (ncurses)
Screenshot coming soon

### [Web](https://github.com/benbusby/tiny-moon-runner/tree/web)
<p align="center">
  <img src="./img/demo.gif">
</p>

## Running the Game
To play the game, you can do one of the following:
- Command Line
    - Requires ncurses
    ```
    git clone https://github.com/benbusby/tiny-moon-runner.git
    cd tiny-moon-runner
    make
    ./tiny-moon-runner
    ```
- Web
    ```
    git clone https://github.com/benbusby/tiny-moon-runner.git
    cd tiny-moon-runner
    make
    ./tiny-moon-runner
    ```
Or play the game in your browser on [Itch.io](https://benbusby.itch.io/tiny-moon-runner)
