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

    copyOf() {
        return new SudokuConfiguration(
            this.#difficulty,
            this.#paperSize,
            this.#puzzleCount,
            this.#requireSymmetry,
            this.#showSolutions,
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