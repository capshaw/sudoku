/**
 * SudokuConfiguration.
 *
 * Container class for storing a configuration / options for generating sudoku puzzles.
 */
class SudokuConfiguration {
    #difficulty;
    #paperSize;
    #puzzleCount;
    #requireSymmetry;
    #showSolutions;

    constructor(difficulty, paperSize, puzzleCount, requireSymmetry, showSolutions) {
        this.#difficulty = difficulty;
        this.#paperSize = paperSize;
        this.#puzzleCount = puzzleCount;
        this.#requireSymmetry = requireSymmetry;
        this.#showSolutions = showSolutions;
    }

    static fresh() {
        return new SudokuConfiguration(null, null, null, null, null);
    }

    copyOf() {
        return new SudokuConfiguration(
            this.#difficulty,
            this.#paperSize,
            this.#puzzleCount,
            this.#requireSymmetry,
            this.#showSolutions,
        )
    }

    isComplete() {
        return (
            this.#difficulty !== null &&
            this.#paperSize !== null &&
            this.#puzzleCount !== null &&
            this.#requireSymmetry !== null &&
            this.#showSolutions !== null
        )
    }

    get difficulty() {
        return this.#difficulty;
    }

    set difficulty(difficulty) {
        this.#difficulty = difficulty;
    }

    get paperSize() {
        return this.#paperSize;
    }

    set paperSize(paperSize) {
        this.#paperSize = paperSize;
    }

    get puzzleCount() {
        return this.#puzzleCount;
    }

    set puzzleCount(puzzleCount) {
        this.#puzzleCount = puzzleCount;
    }

    get requireSymmetry() {
        return this.#requireSymmetry;
    }

    set requireSymmetry(requireSymmetry) {
        this.#requireSymmetry = requireSymmetry;
    }

    get showSolutions() {
        return this.#showSolutions;
    }

    set showSolutions(showSolutions) {
        this.#showSolutions = showSolutions;
    }
}

export { SudokuConfiguration }