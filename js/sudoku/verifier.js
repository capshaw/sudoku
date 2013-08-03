// Given a sudoku object, finds problems associated with it.
var SudokuVerifier = function () {

    var getValueChecker = function () {
        var checker = {}
        for(var i = 0; i < 9; i++) {
            checker[i + 1] = []
        }
        return checker;
    }

    var verify = function (puzzle) {

        var errors = [];

        for(var i = 0; i < 9; i++) {
            errors = errors.concat(verifyRow(puzzle, i));
        }

        for(var i = 0; i < 9; i++) {
            errors = errors.concat(verifyColumn(puzzle, i));
        }

        for(var x = 0; x < 3; x++) {
            for(var y = 0; y < 3; y++) {
                errors = errors.concat(verifySquare(puzzle, x*3, y*3));
            }
        }

        return errors;
    }

    // todo: refactor using new getSquare
    var verifySquare = function (puzzle, x, y) {
        var checker = getValueChecker();
        var errors = [];

        for(var dx = 0; dx < 3; dx++) {
            for(var dy = 0; dy < 3; dy++) {
                var val = puzzle.get(x + dx, y + dy);
                if(!val) continue;
                checker[val].push(Tuple(x + dx, y + dy));
            }
        }

        for(var key in checker) {
            var val = checker[key];
            if(val.length > 1) {
                errors = errors.concat(val);
            }
        }

        return errors;
    }

    // todo: refactor using new getRow
    var verifyRow = function (sudoku, i) {
        var row = getValueChecker();
        var errors = [];

        for(var j = 0; j < 9; j++) {
            var val = sudoku.get(j, i);
            if(!val) continue;
            row[val].push(Tuple(j, i));
        }

        for(var key in row) {
            var val = row[key];
            if(val.length > 1) {
                errors = errors.concat(val);
            }
        }

        return errors;
    }

    // todo: refactor using new getColumn
    var verifyColumn = function (sudoku, i) {
        var column = getValueChecker();
        var errors = [];

        for(var j = 0; j < 9; j++) {
            var val = sudoku.get(i, j);
            if(!val) continue;
            column[val].push(Tuple(i, j));
        }

        for(var key in column) {
            var val = column[key];
            if(val.length > 1) {
                errors = errors.concat(val);
            }
        }

        return errors;
    }

    return {
        verify: verify
    }
}