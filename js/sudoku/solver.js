// Provides functionality for solving a sudoku puzzle.
var SudokuSolver = function () {

    var isSolvable = function (puzzle) {
        var clone = solve(puzzle);
        return (clone.getFilledTiles() == 81);
    }

    var solve = function (puzzle) {
        var clone = puzzle.getClone();
        var lastFilledTileCount;
        do {
            lastFilledTileCount = clone.getFilledTiles();

            var square;
            var row;
            var column;
            for(var y = 0; y < 9; y++) {
                row = clone.getRow(y);
                for(var x = 0; x < 9; x++) {

                    if(clone.get(x, y) > 0 && clone.get(x, y) < 9){
                        continue;
                    }

                    column = clone.getColumn(x);
                    square = clone.getSquare(Math.floor(x/3),
                                             Math.floor(y/3))

                    // Set every digit to be available.
                    var choices = [0,0,0,0,0,0,0,0,0];

                    // Mark used digits.
                    var pos;
                    for(pos in row){
                        choices[row[pos] - 1] = 1;
                    }
                    for(pos in column){
                        choices[column[pos] - 1] = 1;
                    }
                    for(var j in square){
                        for(var i in square[j]){
                            choices[square[j][i] - 1] = 1;
                        }
                    }

                    // Process to see what remains.
                    possibleAnswers = [];
                    for(var h = 0; h < 9; h++){
                        if(choices[h] == 0){
                            possibleAnswers.push(h + 1);
                        }
                    }

                    // Set at answer if only one choice remains.
                    if(possibleAnswers.length == 1){
                        clone.set(x, y, possibleAnswers[0]);
                    }
                }
            }
        } while (lastFilledTileCount < clone.getFilledTiles());

        return clone;
    }

    return {
        isSolvable: isSolvable,
        solve: solve
    }
}
