/**
 * The side portion of the application that allows the user to modify the configuration of the
 * generated sudoku puzzles.
 */
class Sidebar extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open',
        });
    }

    connectedCallback() {
        this.shadow.innerHTML = /* html */`
            <style>
                @import "src/app/paper-sudoku.css";

                #options {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    bottom: 20px;
                    width: 240px;
                    background: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-sizing: border-box;
                    overflow: scroll;
                    padding-bottom: 100px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    z-index: 5;
                }

                #options h2 {
                    font-size: 110%;
                    border-bottom: 1px solid #000;
                }

                @media (max-width: 600px) {
                    #options {
                        position: unset;
                        width: auto;
                        margin: 20px 20px 0 20px;
                        padding-bottom: 20px;
                    }
                }

                @media print {
                    #options {
                        display: none;
                    }
                }
            </style>
            <div id="options">
                <paper-sudoku-logo></paper-sudoku-logo>
                <h2>
                    About
                </h2>
                <p>
                    Welcome! This is a sudoku generator optimized for print or tablet usage.
                </p>
                <p>
                    To use, first configure your options below and then use your browser print
                    functionality. Be mindful of the browser options and paper size you have set there.
                </p>
                <h2>
                    Options
                </h2>
                <form>
                    <input-numeric
                        name="puzzleCount"
                        header="Number of puzzles"
                        min="1"
                        max="1000"
                        value="5"></input-numeric>
                    <input-select
                        name="paperSize"
                        header="Paper Size"
                        options="A6,A5,Letter"
                        value="A5"></input-select>
                    <input-select
                        name="difficulty"
                        header="Difficulty"
                        options="Easy,Medium"
                        value="Medium"></input-select>
                    </input-select>
                    <input-checkbox
                        name="requireSymmetry"
                        header="Clue symmetry"
                        summary="Makes prettier rotationally symmetrical puzzles"
                        value="true"></input-checkbox>
                    <input-checkbox
                        name="showSolutions"
                        header="Include solutions"
                        summary="Solutions are printed at the back of the puzzle set"
                        value="true"></input-checkbox>
                </form>
                <print-button></print-button>
            </div>
        `;
    }
}

export { Sidebar }