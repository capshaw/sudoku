/**
 * A model of a Sudoku puzzle
 */
class Sudoku {

    constructor() {
        this.puzzle = {};
    }

    set(x, y, v) {
        if(this.puzzle[y] == undefined) {
            this.puzzle[y] = {};
        }
        this.puzzle[y][x] = v;
    }

    remove(x, y) {
        this.set(x, y, -1);
    }

    get(x, y) {
        if (this.puzzle[y] !== undefined && this.puzzle[y][x] !== undefined) {
            return this.puzzle[y][x];
        }
        return -1;
    }

    getRow(y) {
        if(this.puzzle[y] !== undefined) {
            return this.puzzle[y];
        }
        return {};
    }

    getColumn(x) {
        var column = {};
        for(var y = 0; y < 9; y++){
            column[y] = this.get(x, y);
        }
        return column;
    }

    getSquare(x, y) {
        var square = {};
        for(var dy = 0; dy < 3; dy++) {
            square[y * 3 + dy] = {};
            for(var dx = 0; dx < 3; dx++) {
                const tuple = new Tuple(x * 3 + dx, y * 3 + dy);
                square[tuple.y][tuple.x] = this.get(tuple.x, tuple.y);
            }
        }
        return square;
    }

    getClone() {
        var clone = new Sudoku();
        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 9; x++) {
                clone.set(x, y, this.get(x,y));
            }
        }
        return clone;
    }

    getFilledTiles() {
        var count = 0;
        for(var y = 0; y < 9; y++){
            for(var x = 0; x < 9; x++){
                if(this.get(x, y) != -1 && this.get(x, y) != ""){
                    count++;
                }
            }
        }
        return count;
    }
}