// Profides functionality for solving a sudoku puzzle.
var SudokuSolver = function () {

    var isSolvable = function (puzzle) {
        var clone = solve(puzzle);
        return (clone.getFilledTiles() == 81);
    }

    var solve = function (puzzle) {

        var clone = puzzle.getClone();

        var lastFilledTileCount;
        for(var retries = 0; retries < 5; retries++){
            do {
                lastFilledTileCount = clone.getFilledTiles();

                var columns = [];
                for(var j = 0; j < 9; j++){
                    columns.push(clone.getColumn(j));
                }

                var rows = [];
                for(var i = 0; i < 9; i++){
                    rows.push(clone.getRow(i));
                }

                var squares = [];
                for(var y = 0; y < 3; y++){
                    for(var x = 0; x < 3; x++){
                        squares.push(clone.getSquare(x, y));
                    }
                }

                for(var y = 0; y < 9; y++) {
                    for(var x = 0; x < 9; x++) {

                        if(clone.get(x, y) > 0 && clone.get(x, y) < 9){
                            continue;
                        }

                        // Set every digit to be available.
                        var choices = [0,0,0,0,0,0,0,0,0];
                        var row = rows[y];
                        var column = columns[x];
                        var square = squares[Math.floor(x/3) + Math.floor(y/3) * 3]

                        // Mark used digits
                        var pos;
                        for(pos in row){
                            choices[row[pos] - 1] = 1;
                        }
                        for(pos in column){
                            choices[column[pos] - 1] = 1;
                        }
                        for(yy in square){
                            for(xx in square[yy]){
                                choices[square[yy][xx] - 1] = 1;
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
        }

        return clone;
    }

    return {
        isSolvable: isSolvable,
        solve: solve
    }
}
