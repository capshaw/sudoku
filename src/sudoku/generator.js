import { Difficulty } from "./difficulty.js";
import { Sudoku } from "./sudoku.js";
import { SudokuSolver } from "./solver.js";

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
        const temp = puzzle[a];
        puzzle[a] = puzzle[b];
        puzzle[b] = temp;
        return puzzle;
    }

    #swapColumns(puzzle, a, b) {
        for(let i = 0; i < 9; i++){
            const temp = puzzle[i][a];
            puzzle[i][a] = puzzle[i][b];
            puzzle[i][b] = temp;
        }
        return puzzle;
    }

    #swapValues(puzzle, a, b) {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                const value = puzzle[i][j];
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
        let puzzle = JSON.parse(JSON.stringify(SudokuGenerator.SUDOKU_TEMPLATE));

        for(let i = 0; i < 1000; i++) {

            // Pick a random type of swapping to do.
            const type = Math.floor((Math.random() * 3)); // 0 - 2

            // Random numbers in the specified ranges.
            const a = Math.floor((Math.random() * 9));    // 0 - 8
            const c = Math.floor((Math.random() * 9));    // 0 - 8
            const v = Math.floor((Math.random() * 3));    // 0 - 2
            const b = Math.floor(a/3) * 3 + v;

            switch(type){
                case 0: puzzle = this.#swapRows(puzzle, a, b); break;
                case 1: puzzle = this.#swapColumns(puzzle, a, b); break;
                case 2: puzzle = this.#swapValues(puzzle, a + 1, c + 1); break;
            }
        }

        const sudoku = new Sudoku();
        for(let y = 0; y < 9; y++) {
            for(let x = 0; x < 9; x++) {
                sudoku.set(x, y, puzzle[y][x])
            }
        }

        // TODO: Constant retries should be stored somewhere else. Consider >= 10 as well.
        for(let retries = 0; retries < 10; retries++){
            let lastRemovedValues = {};
            while(this.#shouldContinueRemovingValues(sudoku, difficulty)) {
                const x = Math.floor((Math.random() * 9));
                const y = Math.floor((Math.random() * 9));
                const nx = 8 - x;
                const ny = 8 - y;

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

            for(let y in lastRemovedValues){
                for(let x in lastRemovedValues[y]){
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