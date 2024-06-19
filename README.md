![Paper Sudoku](img/paper-sudoku.png)

## What is this?

This project is a print-focused sudoku generator. It supports quick generation of puzzles with the intention of the puzzles either being printed to paper or to PDF (for use with tablets).

This project has gone through several iterations over the decade or so that it has existed. It originally started as an online Sudoku generator, solver, and UI that allowed users to play sudoku in a browser window. 

## Solver Limitations

Currently, the solver can only solve relatively simple sudoku instances that don't require backtracking or other more complex deduction strategies to solve. That is left as an exercise to the reader.

# Build

There is no build step for the Javascript side of this project. Simply host this folder with whatever simple HTTP server you'd like. Locally I use Python's built in HTTP server:

```
python3 -m http.server
```

There is a build step for the SASS / CSS that is currently required to modify the CSS:

```
sass --watch css/sudoku.scss:css/sudoku.css
``` 

For convenience, I've included the built CSS in the repo. Not a best practice, but convenient for anyone who just wants to play with the Javascript. I also have a desire to move away from SASS here, but that is in the TODO pile.

# TODOs and potential next steps

- SASS should no longer be necessary, remove it.
- Redo generator in modern module-oriented javascript
- The utility is not currently mobile / small screen friendly. Fix that.
- There is only one 'difficulty level' for these puzzles. Potentially, enable creation of easy, medium, and hard puzzles.
- Make symmetry optional