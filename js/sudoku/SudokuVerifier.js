import { ValueChecker } from "./ValueChecker.js";

/**
 * Given a sudoku puzzle object, find inconsistencies (duplications) in each row, column, and square.
 * 
 * The verifier does not actually check the correctness of the puzzle against the solution. It 
 * only looks for the aforementioned inconsistencies that imply the puzzle to be incorrectly 
 * solved.
 */
class SudokuVerifier {

    verify(puzzle) {
        const errors = [];
        for(let y = 0; y < 9; y++) {
            errors = errors.concat(this.#verifyRow(puzzle, y));
        }
        for(let x = 0; x < 9; x++) {
            errors = errors.concat(this.#verifyColumn(puzzle, x));
        }
        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                errors = errors.concat(this.#verifySquare(puzzle, x * 3, y * 3));
            }
        }
        return errors;
    }

    #verifySquare(puzzle, x, y) {
        const checker = new ValueChecker();
        for(let dx = 0; dx < 3; dx++) {
            for(let dy = 0; dy < 3; dy++) {
                let tuple = Tuple(x + dx, y + dy);
                checker.add(puzzle.get(tuple.x, tuple.y), tuple);
            }
        }
        return checker.getErrors();
    }

    #verifyRow(puzzle, y) {
        const checker = new ValueChecker();
        for(let x = 0; x < 9; x++) {
            checker.add(puzzle.get(x, y), Tuple(x, y));
        }
        return checker.getErrors();
    }

    #verifyColumn(puzzle, x) {
        const checker = new ValueChecker();
        for(let y = 0; y < 9; y++) {
            checker.add(puzzle.get(x, y), Tuple(x, y));
        }
        return checker.getErrors();
    }
}

export { SudokuVerifier };