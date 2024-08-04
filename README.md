# Sudoku for Paper

## What is this?

This project is a print-focused sudoku generator. It supports quick generation of puzzles with the intention of the puzzles either being printed to paper or to PDF (for use with tablets).

This project has gone through several iterations over the decade or so that it has existed. It originally started as an online Sudoku generator, solver, and UI that allowed users to play sudoku in a browser window.

## Solver Limitations

Currently, the solver can only solve relatively simple sudoku instances that don't require backtracking or other more complex deduction strategies to solve. That is left as an exercise to the reader.

## Build

There is no build step for this project. Simply host this folder with whatever simple HTTP server you'd like. Locally I use Python's built in HTTP server:

```bash
python3 -m http.server
```

## TODOs and potential next steps

- Note about /* html */
- Testing
- Share link
- Page jumps due to removing content
- Multiple per page
- Optional build step for fun