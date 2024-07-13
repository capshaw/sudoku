/**
 * A enum-like class to represent sudoku puzzle difficulties.
 */
class Difficulty {
    static Easy = new Difficulty('Easy');
    static Medium = new Difficulty('Medium');

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `Difficulty.${this.name}`;
    }
}

export { Difficulty };