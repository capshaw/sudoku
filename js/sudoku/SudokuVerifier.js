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
        var errors = [];
        for(var y = 0; y < 9; y++) {
            errors = errors.concat(this.#verifyRow(puzzle, y));
        }
        for(var x = 0; x < 9; x++) {
            errors = errors.concat(this.#verifyColumn(puzzle, x));
        }
        for(var x = 0; x < 3; x++) {
            for(var y = 0; y < 3; y++) {
                errors = errors.concat(this.#verifySquare(puzzle, x * 3, y * 3));
            }
        }
        return errors;
    }

    #verifySquare(puzzle, x, y) {
        var checker = new ValueChecker();
        for(var dx = 0; dx < 3; dx++) {
            for(var dy = 0; dy < 3; dy++) {
                var tuple = Tuple(x + dx, y + dy);
                checker.add(puzzle.get(tuple.x, tuple.y), tuple);
            }
        }
        return checker.getErrors();
    }

    #verifyRow(puzzle, y) {
        var checker = new ValueChecker();
        for(var x = 0; x < 9; x++) {
            checker.add(puzzle.get(x, y), Tuple(x, y));
        }
        return checker.getErrors();
    }

    #verifyColumn(puzzle, x) {
        var checker = new ValueChecker();
        for(var y = 0; y < 9; y++) {
            checker.add(puzzle.get(x, y), Tuple(x, y));
        }
        return checker.getErrors();
    }
}

export { SudokuVerifier };