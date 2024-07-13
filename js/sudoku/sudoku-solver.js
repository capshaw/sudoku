/**
 * A sudoku puzzle solver
 */
class SudokuSolver {

    isSolvable(puzzle) {
        return (this.solve(puzzle).getFilledTiles() == 81);
    }

    solve (puzzle) {
        const clone = puzzle.getClone();
        let lastFilledTileCount;
        do {
            lastFilledTileCount = clone.getFilledTiles();

            let square;
            let row;
            let column;
            for(let y = 0; y < 9; y++) {
                row = clone.getRow(y);
                for(let x = 0; x < 9; x++) {

                    if(clone.get(x, y) > 0 && clone.get(x, y) < 9){
                        continue;
                    }

                    column = clone.getColumn(x);
                    square = clone.getSquare(
                        Math.floor(x/3),
                        Math.floor(y/3)
                    );

                    // Set every digit to be available.
                    const choices = [0, 0, 0, 0, 0, 0, 0, 0, 0];

                    // Mark used digits.
                    let pos;
                    for(pos in row){
                        choices[row[pos] - 1] = 1;
                    }
                    for(pos in column){
                        choices[column[pos] - 1] = 1;
                    }
                    for(let j in square){
                        for(let i in square[j]){
                            choices[square[j][i] - 1] = 1;
                        }
                    }

                    // Process to see what remains.
                    let possibleAnswers = [];
                    for(let h = 0; h < 9; h++){
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
}

export { SudokuSolver };