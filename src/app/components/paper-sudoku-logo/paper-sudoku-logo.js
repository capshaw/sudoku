import { SIDEBAR_CONTENT_WIDTH_PX } from '../../constants.js';

/**
 * PaperSudokuLogo.
 *
 * A simple element that displays the logo of the application. One consideration for future
 * improvement is to make this more accessible. This element has no required observed attributes.
 */
class PaperSudokuLogo extends HTMLElement {

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
                    display: inline-block;
                    background: url('src/app/components/paper-sudoku-logo/paper-sudoku-logo.png') no-repeat;
                    width: ${SIDEBAR_CONTENT_WIDTH_PX}px;
                    height: 20px;
                    background-size: contain;
                }
            </style>
            <div aria-label="Paper Sudoku logo"></div>
        `;
    }
}

export { PaperSudokuLogo }