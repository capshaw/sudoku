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