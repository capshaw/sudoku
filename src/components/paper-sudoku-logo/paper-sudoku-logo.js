/**
 *
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
                div {
                    display: inline-block;
                    background: url('src/components/paper-sudoku-logo/paper-sudoku-logo.png') no-repeat;
                    width: 200px;
                    height: 20px;
                    background-size: contain;
                }
            </style>
            <div aria-label="Paper Sudoku logo"></div>
        `;
    }
}

export { PaperSudokuLogo }