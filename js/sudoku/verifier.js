// Given a sudoku object, finds problems associated with it.
var SudokuVerifier = function () {

    // Gather errors from every row, column and square in the puzzle.
    var verify = function (puzzle) {
        var errors = [];
        for(var y = 0; y < 9; y++) {
            errors = errors.concat(verifyRow(puzzle, y));
        }
        for(var x = 0; x < 9; x++) {
            errors = errors.concat(verifyColumn(puzzle, x));
        }
        for(var x = 0; x < 3; x++) {
            for(var y = 0; y < 3; y++) {
                errors = errors.concat(verifySquare(puzzle, x*3, y*3));
            }
        }
        return errors;
    }

    var verifySquare = function (puzzle, x, y) {
        var checker = ValueChecker();
        for(var dx = 0; dx < 3; dx++) {
            for(var dy = 0; dy < 3; dy++) {
                var tuple = Tuple(x + dx, y + dy);
                checker.add(puzzle.get(tuple.x, tuple.y), tuple);
            }
        }
        return checker.getErrors();
    }

    var verifyRow = function (puzzle, y) {
        var checker = ValueChecker();
        for(var x = 0; x < 9; x++) {
            checker.add(puzzle.get(x, y), Tuple(x, y));
        }
        return checker.getErrors();
    }

    var verifyColumn = function (puzzle, x) {
        var checker = ValueChecker();
        for(var y = 0; y < 9; y++) {
            checker.add(puzzle.get(x, y), Tuple(x, y));
        }
        return checker.getErrors();
    }

    return {
        verify: verify
    }
}