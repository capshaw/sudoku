/**
 * SudokuCache.
 *
 * A simple cache for storing generated sudoku puzzles.
 */
class SudokuCache {
    constructor() {
        this.puzzleCache = [];
    }

    clear() {
        this.puzzleCache = [];
    }

    hasCachedPuzzle(pid) {
        return pid < this.puzzleCache.length;
    }

    getCachedPuzzle(pid) {
        if (pid < this.puzzleCache.length) {
            return this.puzzleCache[pid];
        }

        throw new Error(`Puzzle cache does not have puzzle with id ${pid}`);
    }

    setCachedPuzzle(pid, puzzle) {
        this.puzzleCache[pid] = puzzle;
    }
}

export { SudokuCache };