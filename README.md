# Sudoku

I started this project to learn JavaScript by making a game I wanted to play. It grew into a puzzle generator and browser game that creates a fresh Sudoku board, checks that it has exactly one solution, and supports both keyboard and on-screen controls.

[Play Sudoku](https://leggw.github.io/Sudoku/)

## How to play

Choose a difficulty and select **New game**. Select a square, then type a number or use the on-screen keypad. Use the arrow keys to move between squares and **Backspace**, **Delete**, or **Erase** to clear an entry.

Starting clues are locked. Incorrect entries are highlighted and counted as mistakes. **Check solution** tells you whether your current entries are correct so far, and the game recognizes a completed puzzle automatically.

To run it locally, download or clone the repository and open `index.html` in a browser. The game uses plain HTML, CSS, and JavaScript and requires no build step.

## Generating a puzzle

1. **Build a complete board.** A recursive backtracking search tries valid digits in random order. When a choice leads to a dead end, the search clears that square and tries another digit.
2. **Choose the most constrained square first.** Each search step picks the empty square with the fewest legal candidates. I also precompute the squares that share a row, column, or box with each position so the search can reuse those relationships.
3. **Remove clues while preserving a unique solution.** The generator removes one digit at a time and counts solutions for the resulting board. If the search finds a second solution, it stops and restores that clue. This matters because removing clues from a solved board can leave several valid ways to finish it.

Easy, Medium, and Hard start with 38, 36, and 32 clues, respectively. Clue count is a simple difficulty setting. Two puzzles with the same number of clues can still require different solving techniques.

## Interface and code design

The board uses CSS Grid with heavier borders around each 3×3 box. Selecting a square highlights its row, column, and box. The blue board and cyan accents match my portfolio, with a burnt-orange background carried over from the original game.

Keyboard and keypad input both call `enterNumber()` in `script.js`. That keeps clue protection, mistake counting, and completion checks consistent across controls. The game also keeps the starting clues, the solved board, and the player's current board in separate arrays so edits and new games don’t overwrite the puzzle data.

## Verification

I generated 60 puzzles across the three difficulty settings and checked each with a separate solver. I also tested keypad and keyboard entry, locked clues, mistake tracking, puzzle completion, and starting a new game.

## Algorithm references

- [JavaScript Sudoku Solver](https://lisperator.net/blog/javascript-sudoku-solver/)
- [Solving Every Sudoku Puzzle](https://norvig.com/sudoku.html) by Peter Norvig

**MIT No Attribution License**

Copyright 2024 - William Legg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
