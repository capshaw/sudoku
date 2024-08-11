import { SudokuGenerator } from '../sudoku/generator.js';
import { SudokuSolver } from '../sudoku/solver.js';
import { SudokuConfiguration } from './sudoku-configuration.js';
import { EventManager, CONFIGURATION_CHANGE_EVENT_NAME } from './event-manager.js';
import { SudokuCache } from './sudoku-cache.js';

/**
 * Acknowledging this is pretty hacky right now. Still needs a few refactoring passes.
 */
class PaperSudoku extends HTMLElement {

    constructor() {
        super();

        this.generator = new SudokuGenerator();
        this.solver = new SudokuSolver();
        this.puzzleCache = new SudokuCache();
        this.solutionCache = new SudokuCache();
        this.config = SudokuConfiguration.fresh();

        this.shadow = this.attachShadow({
            mode: 'open',
        });

        // TODO: this should be refactored so this knows less about the implementation details
        document.addEventListener(CONFIGURATION_CHANGE_EVENT_NAME, event => {
            const oldConfig = this.config;
            this.config = EventManager.adjustConfiguration(this.config, event);

            if (!this.config.isComplete()) {
                console.log(`[PaperSudoku] Not generating output with incomplete configuration.`);
                return;
            }

            if (this.#shouldHardRegenerate(oldConfig, this.config)) {
                this.puzzleCache.clear();
                this.solutionCache.clear();
            }

            this.#renderLoading();

            const parent = this;
            setTimeout(function () {
                parent.#render();
            }, 500);
        });
    }

    connectedCallback() {
        if (this.config.isComplete()) {
            this.#render();
        }
    }

    /**
     * Certain property changes invalidated old puzzles that have been generated and should force a
     * complete regeneration.
     */
    #shouldHardRegenerate(oldConfig, newConfig) {
        return (
            !oldConfig || !oldConfig.isComplete() || (
                newConfig.requireSymmetry !=
                oldConfig.requireSymmetry
            ) || (
                // TODO: could implement equals in class
                newConfig.difficulty.name !=
                oldConfig.difficulty.name
            )
        )
    }

    #getCachedPuzzleOrMakeOne(pid) {
        if (this.puzzleCache.hasCachedPuzzle(pid)) {
            return this.puzzleCache.getCachedPuzzle(pid);
        } else {
            const puzzle = this.generator.generate(
                this.config.difficulty,
                this.config.requireSymmetry
            );
            this.puzzleCache.setCachedPuzzle(pid, puzzle);
            return puzzle;
        }
    }

    #getCachedSolutionOrMakeOne(pid) {
        if (this.solutionCache.hasCachedPuzzle(pid)) {
            return this.solutionCache.getCachedPuzzle(pid);
        } else {
            const puzzle = this.#getCachedPuzzleOrMakeOne(pid);
            const solution = this.solver.solve(puzzle);
            this.solutionCache.setCachedPuzzle(pid, solution);
            return solution;
        }
    }

    #render() {
        this.shadow.innerHTML = this.#renderCSS() + /* html */`
            <div class="paperset size-${this.config.paperSize.name}">
                ${this.#displayPuzzles()}
                ${this.#displaySolutions()}
            </div>
        `;
    }

    #renderLoading() {
        this.shadow.innerHTML = /* html */`
            <loading-indicator></loading-indicator>
        `;
    }

    // TODO: this is so long that it implies that this probably needs to be broken into multiple components
    #renderCSS() {
        return /* html */`
            <style>
                @import "src/app/paper-sudoku.css";

                .paperset {
                    margin-top: 20px;
                    margin-left: 280px;
                    margin-right: 20px;
                }

                /* TODO: put this in a constant and share across components */
                @media (max-width: 600px) {
                    .paperset {
                        margin-left: auto;
                        margin-right: auto;
                        padding-left: 20px;
                        padding-right: 20px;
                    }
                }

                @media print {
                    .paperset {
                        margin-left: 0;
                        margin-top: 0;
                        margin-right: 0;
                    }
                }

                table {
                    margin-bottom: 20px;
                    width: 100%;
                    border-collapse: collapse;
                }

                /* Safari doesn't seem to allow aspect-ratio on tables. That's why this extra div exists. */
                .sudoku-cell {
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    display: grid;
                    align-items:center;
                }

                td {
                    border: 1px solid black;
                    aspect-ratio: 1 / 1;
                    text-align: center;
                }

                tr:nth-of-type(3n) td {
                    border-bottom: 4px solid black;
                }

                tr:nth-of-type(1) td {
                    border-top: 4px solid black;
                }

                td:nth-of-type(3n) {
                    border-right: 4px solid black;
                }

                td:nth-of-type(1) {
                    border-left: 4px solid black;
                }

                h1, h2 {
                    margin-top: 0;
                }

                .title-page h1 {
                    font-size: 3em;
                    text-align: center;
                }

                .title-page h2 {
                    font-size: 2em;
                    text-align: center;
                }

                @media print {
                    #puzzlesContainer .paper:first-of-type {
                        break-before: avoid;
                    }
                }

                /* TODO: refactor this.. copy/pasted from SCSS output */
                .paperset.size-A6 .paper {
                    aspect-ratio: 105/148; }
                    @media print {
                        .paperset.size-A6 .paper {
                        max-width: 105mm;
                        width: 105mm;
                        aspect-ratio: unset; } }
                    .paperset.size-A6 .paper.title-page {
                        padding-top: 200px; }
                        @media print {
                        .paperset.size-A6 .paper.title-page {
                            padding-top: calc(148mm / 2 - 3em); } }
                    .paperset.size-A5 .paper {
                    aspect-ratio: 148/210; }
                    @media print {
                        .paperset.size-A5 .paper {
                        max-width: 148mm;
                        width: 148mm;
                        aspect-ratio: unset; } }
                    .paperset.size-A5 .paper.title-page {
                        padding-top: 200px; }
                        @media print {
                        .paperset.size-A5 .paper.title-page {
                            padding-top: calc(210mm / 2 - 3em); } }
                    .paperset.size-Letter .paper {
                    aspect-ratio: 8.5/11; }
                    @media print {
                        .paperset.size-Letter .paper {
                        max-width: 8.5in;
                        width: 8.5in;
                        aspect-ratio: unset; } }
                    .paperset.size-Letter .paper.title-page {
                        padding-top: 200px; }
                        @media print {
                        .paperset.size-Letter .paper.title-page {
                            padding-top: calc(11in / 2 - 3em); } }
                    .paperset .paper {
                    background: #fff;
                    margin: 20px auto;
                    max-width: 600px;
                    padding: 20px;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                    box-sizing: border-box;
                    border-radius: 5px; }
                    @media print {
                        .paperset .paper {
                        box-shadow: none;
                        margin: auto;
                        padding: 0;
                        break-before: page; } }

            </style>
        `;
    }

    /**
     * Returns an HTML string representing the puzzles to display.
     */
    #displayPuzzles() {
        let puzzles = '';
        for (let i = 0; i < this.config.puzzleCount; i++) {
            puzzles += this.#displayPuzzle(i, this.#getCachedPuzzleOrMakeOne(i), false);
        }

        return /* html */`
            <div id="puzzlesContainer">
                ${puzzles}
            </div>
        `;
    }

    /**
     * Depending on whether or not the application is configured to display solutions, return
     * a string representing those solutions or an empty string otherwise.
     */
    #displaySolutions() {
        if (!this.config.showSolutions) {
            return ``;
        }

        let solutions = '';
        for (let i = 0; i < this.config.puzzleCount; i++) {
            solutions += this.#displayPuzzle(i, this.#getCachedSolutionOrMakeOne(i), true);
        }

        return /* html */`
            <div id="solutionsHeader" class="paper title-page">
                <h2>
                    Solutions
                </h2>
            </div>
            <div>
                ${solutions}
            </div>
        `;
    }

    /**
     * Returns the HTML representation of a sudoku row.
     */
    #displayRow(row) {
        return /* html */`
            <tr>${this.#displayColumns(row)}</tr>
        `;
    }

    /**
     * Returns the HTML representation of the columns within a sudoku row. Note that the hard-coded
     * percentage for the <td> width is helpful/necessary for display in some browsers.
     */
    #displayColumns(row) {
        let columns = '';
        for (let i = 0; i < 9; i++) {
            // Being overly specific with width is helpful for some browsers
            columns += /* html */`
                <td width="11.11%">
                    <div class="sudoku-cell">${row[i] == -1 ? '&nbsp;' : row[i]}</div>
                </td>
            `;
        }
        return columns;
    }

    /**
     * Given either a puzzle or a solution to a sudoku, returns an HTML representation of that
     * puzzle or solution.
     */
    #displayPuzzle(pid, puzzleOrSolution, isSolution) {
        const puzzleNumber = pid + 1
        const parent = this;
        return /* html */`
            <div class="paper">
                <h2>${isSolution ? `Solution ${puzzleNumber}` : `Puzzle ${puzzleNumber}`}</h2>
                <table>
                    ${(function generateRows(puzzleOrSolution) {
                        let rows = '';
                        for (let j = 0; j < 9; j++) {
                            rows += parent.#displayRow(puzzleOrSolution.getRow(j));
                        }
                        return rows;
                    })(puzzleOrSolution)}
                </table>
            </div>
        `;
    }
}

export { PaperSudoku };