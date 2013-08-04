// A container for a Sudoku puzzle.
var Sudoku = function () {

    var filledTiles = 0;
    var puzzle = {};

    var set = function (x, y, v) {
        if(puzzle[y] == undefined) {
            puzzle[y] = {};
        }
        puzzle[y][x] = v;
    }

    var remove = function (x, y) {
        set(x, y, -1);
    }

    var get = function (x, y) {
        if (puzzle[y] !== undefined && puzzle[y][x] !== undefined) {
            return puzzle[y][x];
        }
        return -1;
    }

    var getRow = function (y) {
        if(puzzle[y] !== undefined) {
            return puzzle[y];
        }
        return {};
    }

    var getColumn = function (x) {
        var column = {};
        for(var y = 0; y < 9; y++){
            column[y] = get(x, y);
        }
        return column;
    }

    var getSquare = function (x, y) {
        var square = {};
        for(var dy = 0; dy < 3; dy++) {
            square[y * 3 + dy] = {};
            for(var dx = 0; dx < 3; dx++) {
                tuple = Tuple(x * 3 + dx, y * 3 + dy);
                square[tuple.y][tuple.x] = get(tuple.x, tuple.y);
            }
        }
        return square;
    }

    var getClone = function () {
        var clone = Sudoku();
        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 9; x++) {
                clone.set(x, y, get(x,y));
            }
        }
        return clone;
    }

    var getFilledTiles = function () {
        var count = 0;
        for(var y = 0; y < 9; y++){
            for(var x = 0; x < 9; x++){
                if(get(x, y) != -1 && get(x, y) != ""){
                    count++;
                }
            }
        }
        return count;
    }

    return {
        set: set,
        remove: remove,
        get: get,
        getRow: getRow,
        getColumn: getColumn,
        getSquare: getSquare,
        getClone: getClone,
        getFilledTiles: getFilledTiles
    }
}