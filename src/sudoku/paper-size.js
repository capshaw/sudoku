/**
 * A enum-like class to represent sudoku puzzle paper size.
 *
 * Long-term, it might be able to make printing responsive to all paper sizes rather than have this
 * in the configuration.
 */
class PaperSize {
    static A6 = new PaperSize('A6');
    static A5 = new PaperSize('A5');
    static Letter = new PaperSize('Letter');

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
        return `PaperSize.${this.#name}`;
    }
}

export { PaperSize };