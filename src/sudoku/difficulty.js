/**
 * A enum-like class to represent sudoku puzzle difficulties.
 */
class Difficulty {
    static Easy = new Difficulty('Easy');
    static Medium = new Difficulty('Medium');

    #name;

    constructor(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    toString() {
        return `Difficulty.${this.#name}`;
    }
}

export { Difficulty };