import { Difficulty } from "./Difficulty.js";
import { Sudoku } from "./Sudoku.js";
import { SudokuSolver } from "./SudokuSolver.js";

/**
 * A sudoku puzzle generator
 */
class SudokuGenerator {

    static EASY_STARTING_TILE_LIMIT = 50;
    static SUDOKU_TEMPLATE = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
    ];

    constructor() {
        this.solver = new SudokuSolver();
        this.lastGeneratedPuzzle = null;
    }

    #swapRows(puzzle, a, b) {
        var temp = puzzle[a];
        puzzle[a] = puzzle[b];
        puzzle[b] = temp;
        return puzzle;
    }

    #swapColumns(puzzle, a, b) {
        for(var i = 0; i < 9; i++){
            var temp = puzzle[i][a];
            puzzle[i][a] = puzzle[i][b];
            puzzle[i][b] = temp;
        }
        return puzzle;
    }

    #swapValues(puzzle, a, b) {
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                var value = puzzle[i][j];
                if(value == a) {
                    puzzle[i][j] = b;
                }
                if(value == b) {
                    puzzle[i][j] = a;
                }
            }
        }
        return puzzle;
    }

    #shouldContinueRemovingValues(sudoku, difficulty) {
        switch (difficulty.name) {
            case Difficulty.Easy.name: return (
                this.solver.isSolvable(sudoku) &&
                sudoku.getFilledTiles() >= SudokuGenerator.EASY_STARTING_TILE_LIMIT
            );
            case Difficulty.Medium.name: return this.solver.isSolvable(sudoku);
            default: throw new Error(`Unsupported difficulty ${difficulty.name}`);
        }
    }

    generate(difficulty, requireSymmetry) {
        var puzzle = JSON.parse(JSON.stringify(SudokuGenerator.SUDOKU_TEMPLATE));

        for(var i = 0; i < 1000; i++) {

            // Pick a random type of swapping to do.
            var type = Math.floor((Math.random() * 3)); // 0 - 2

            // Random numbers in the specified ranges.
            var a = Math.floor((Math.random() * 9));    // 0 - 8
            var c = Math.floor((Math.random() * 9));    // 0 - 8
            var v = Math.floor((Math.random() * 3));    // 0 - 2
            var b = Math.floor(a/3) * 3 + v;

            switch(type){
                case 0: puzzle = this.#swapRows(puzzle, a, b); break;
                case 1: puzzle = this.#swapColumns(puzzle, a, b); break;
                case 2: puzzle = this.#swapValues(puzzle, a + 1, c + 1); break;
            }
        }

        var sudoku = new Sudoku();
        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 9; x++) {
                sudoku.set(x, y, puzzle[y][x])
            }
        }

        // TODO: Constant retries should be stored somewhere else. Consider >= 10 as well.
        for(var retries = 0; retries < 10; retries++){
            var lastRemovedValues = {};
            while(this.#shouldContinueRemovingValues(sudoku, difficulty)) {
                var x = Math.floor((Math.random() * 9));
                var y = Math.floor((Math.random() * 9));
                var nx = 8 - x;
                var ny = 8 - y;

                lastRemovedValues = {};
                lastRemovedValues[y] = {};
                lastRemovedValues[ny] = {};

                lastRemovedValues[y][x] = sudoku.get(x, y);
                lastRemovedValues[ny][nx] = sudoku.get(nx, ny);

                sudoku.remove(x, y);
                if (requireSymmetry) {
                    sudoku.remove(nx, ny);
                }
            }

            for(var y in lastRemovedValues){
                for(var x in lastRemovedValues[y]){
                    sudoku.set(x, y, lastRemovedValues[y][x]);
                }
            }
        }

        this.lastGeneratedPuzzle = sudoku.getClone();
        return sudoku;
    }

    getLastGeneratedPuzzle() {
        return this.lastGeneratedPuzzle;
    }
}

export { SudokuGenerator };