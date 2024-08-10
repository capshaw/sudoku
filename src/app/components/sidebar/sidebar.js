import {
    VIEWPORT_BREAK_WIDTH_PX,
    STANDARD_PADDING_PX,
    SIDEBAR_WIDTH_PX,
    STANDARD_BORDER_RADIUS_PX,
    Z_INDEX_SIDEBAR,
} from '../../constants.js';

import {
    CONFIGURATION_KEY_PAPER_SIZE,
    CONFIGURATION_KEY_DIFFICULTY,
    CONFIGURATION_KEY_PUZZLE_COUNT,
    CONFIGURATION_KEY_REQUIRE_SYMMETRY,
    CONFIGURATION_KEY_SHOW_SOLUTIONS,
} from '../../events.js';

/**
 * Sidebar.
 *
 * The side portion of the application that allows the user to modify the configuration of the
 * generated sudoku puzzles. The element no required observed attributes.
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
                @import 'src/app/paper-sudoku.css';

                div {
                    position: fixed;
                    top: ${STANDARD_PADDING_PX}px;
                    left: ${STANDARD_PADDING_PX}px;
                    bottom: ${STANDARD_PADDING_PX}px;

                    width: ${SIDEBAR_WIDTH_PX}px;
                    padding: ${STANDARD_PADDING_PX}px;
                    box-sizing: border-box;

                    background: #fff;
                    border-radius: ${STANDARD_BORDER_RADIUS_PX}px;
                    overflow: scroll;
                    padding-bottom: 100px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    z-index: ${Z_INDEX_SIDEBAR};
                }

                div h2 {
                    font-size: 110%;
                    border-bottom: 1px solid #000;
                }

                @media (max-width: ${VIEWPORT_BREAK_WIDTH_PX}px) {
                    div {
                        position: unset;
                        width: auto;
                        margin:
                            ${STANDARD_PADDING_PX}px
                            ${STANDARD_PADDING_PX}px
                            0
                            ${STANDARD_PADDING_PX}px;
                        padding-bottom: ${STANDARD_PADDING_PX}px;
                    }
                }

                @media print {
                    div {
                        display: none;
                    }
                }
            </style>
            <div>
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
                        name="${CONFIGURATION_KEY_PUZZLE_COUNT}"
                        header="Number of puzzles"
                        min="1"
                        max="1000"
                        value="5"></input-numeric>
                    <input-select
                        name="${CONFIGURATION_KEY_PAPER_SIZE}"
                        header="Paper Size"
                        options="A6,A5,Letter"
                        value="A5"></input-select>
                    <input-select
                        name="${CONFIGURATION_KEY_DIFFICULTY}"
                        header="Difficulty"
                        options="Easy,Medium"
                        value="Medium"></input-select>
                    </input-select>
                    <input-checkbox
                        name="${CONFIGURATION_KEY_REQUIRE_SYMMETRY}"
                        header="Clue symmetry"
                        summary="Makes prettier rotationally symmetrical puzzles"
                        value="true"></input-checkbox>
                    <input-checkbox
                        name="${CONFIGURATION_KEY_SHOW_SOLUTIONS}"
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