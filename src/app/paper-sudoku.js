import { Difficulty } from "../sudoku/difficulty.js";
import { SudokuGenerator } from "../sudoku/generator.js";
import { SudokuSolver } from "../sudoku/solver.js";
import { InputCheckbox } from "../components/input/checkbox.js";
import { InputNumeric } from "../components/input/numeric.js";
import { InputSelect } from "../components/input/select.js";

/**
 * Acknowledging this is pretty hacky right now. Needs a few refactoring passes.
 */
class PaperSudoku {
    static HIDDEN_CLASS_NAME = 'hidden';
    static EMPTY_CONTAINER_STATE = '';

    static ID_LOADING_POPOVER = 'loadingPopover';
    static ID_OVERALL_CONTAINER = 'overallContainer';
    static ID_PUZZLES_CONTAINER = 'puzzlesContainer';
    static ID_SOLUTIONS_CONTAINER = 'solutionsContainer';
    static ID_SOLUTIONS_HEADER = 'solutionsHeader';

    constructor() {
        this.generator = new SudokuGenerator();
        this.solver = new SudokuSolver();
        this.config = null;

        // TODO: these should be a unified data structure likely
        this.puzzleCache = [];
        this.solutionCache = [];

        // TODO: is there a better place to do this?
        customElements.define('input-checkbox', InputCheckbox);
        customElements.define('input-numeric', InputNumeric);
        customElements.define('input-select', InputSelect);
    }

    // TODO: Lots of constants to fix including event, and keys
    initialize (configuration) {
        this.config = configuration;
        this.regenerateSudoku(configuration);

        // TODO: not sure if it's normal to reference 'document' in module like this
        document.addEventListener('change-configuration', event => {
            console.log(event.detail);
            const newConfig = this.config.copyOf();

            // TODO: make these constants
            switch (event.detail.key) {
                case 'paperSize':
                    newConfig.paperSize = new PaperSize(event.detail.value);
                    break;
                case 'difficulty':
                    newConfig.difficulty = new Difficulty(event.detail.value);
                    break;
                case 'puzzleCount':
                    newConfig.puzzleCount = event.detail.value;
                    break;
                case 'requireSymmetry':
                    newConfig.requireSymmetry = event.detail.value;
                    break;
                case 'showSolutions':
                    newConfig.showSolutions = event.detail.value;
                    break;
                default:
                    throw Error(`Event handling for type '${event.detail.key}'' not implemented`);
            }

            console.log(newConfig);
            this.regenerateSudoku(newConfig);
        });
    }

    regenerateSudoku(newConfig) {
        const shouldHardRegenerate = this.#shouldHardRegenerate(this.config, newConfig);
        this.config = newConfig;

        // Reset the visibility of all containers and remove their content
        this.hideSolutionsHeader();
        this.showLoadingPopover();
        this.emptyPuzzlesContainer();
        this.emptySolutionsContainer();

        // Generate the puzzles and set the correct visibility of various elements
        setTimeout(() => {
            this.generatePuzzles(shouldHardRegenerate);
            this.hideLoadingPopover();
        }, 100);
    }

    /**
     * Certain property changes invalidated old puzzles that have been generated and should force a
     * complete regeneration.
     */
    #shouldHardRegenerate(oldConfig, newConfig) {
        return (
            !oldConfig || (
                newConfig.requireSymmetry !=
                oldConfig.requireSymmetry
            ) || (
                // TODO: could implement equals in class
                newConfig.difficulty.name !=
                oldConfig.difficulty.name
            )
        )
    }

    // TODO: these are probably no long necessary, clean up
    getPuzzleCount() {
        return this.config.puzzleCount;
    }

    getPaperSize() {
        return this.config.paperSize;
    }

    getShowSolutions() {
        return this.config.showSolutions;
    }

    getDifficulty() {
        return this.config.difficulty;
    }

    getRequireSymmetry() {
        return this.config.requireSymmetry;
    }

    emptySolutionsContainer() {
        document.getElementById(PaperSudoku.ID_SOLUTIONS_CONTAINER).innerHTML = PaperSudoku.EMPTY_CONTAINER_STATE;
    }

    emptyPuzzlesContainer() {
        document.getElementById(PaperSudoku.ID_PUZZLES_CONTAINER).innerHTML = PaperSudoku.EMPTY_CONTAINER_STATE;
    }

    showSolutionsHeader() {
        document.getElementById(PaperSudoku.ID_SOLUTIONS_HEADER).classList.remove(PaperSudoku.HIDDEN_CLASS_NAME);
    }

    hideSolutionsHeader() {
        document.getElementById(PaperSudoku.ID_SOLUTIONS_HEADER).classList.add(PaperSudoku.HIDDEN_CLASS_NAME);
    }

    showLoadingPopover() {
        document.getElementById(PaperSudoku.ID_LOADING_POPOVER).classList.remove(PaperSudoku.HIDDEN_CLASS_NAME);
    }

    hideLoadingPopover() {
        document.getElementById(PaperSudoku.ID_LOADING_POPOVER).classList.add(PaperSudoku.HIDDEN_CLASS_NAME);
    }

    setPaperSize(paperSize) {
        // TODO: make this more robust against 'paperset' name changes
        const overallContainerElement = document.getElementById(PaperSudoku.ID_OVERALL_CONTAINER);
        overallContainerElement.classList = `paperset size-${paperSize.name}`;
    }

    /**
     * Returns the HTML representation of a sudoku row.
     */
    displayRow(row) {
        return `<tr>${this.displayColumns(row)}</tr>`;
    }

    /**
     * Returns the HTML representation of the columns within a sudoku row.
     */
    displayColumns(row) {
        var columns = '';
        for (var i = 0; i < 9; i++) {
            // Being overly specific with width is helpful for some browsers
            columns += `<td width="11.11%"><div class="sudoku-cell">${row[i] == -1 ? '&nbsp;' : row[i]}</div></td>`;
        }
        return columns;
    }

    /**
     * Given either a puzzle or a solution to a sudoku, returns an HTML representation of that
     * puzzle or solution.
     */
    displayPuzzle(pid, puzzleOrSolution, isSolution) {
        const puzzleNumber = pid + 1;
        const puzzleTitle = isSolution ? `Solution ${puzzleNumber}` : `Puzzle ${puzzleNumber}`;

        const solutionId = `solution-${puzzleNumber}`;
        const puzzleId = `puzzle-${puzzleNumber}`;
        const id = isSolution ? solutionId : puzzleId;
        const antiId = isSolution ? puzzleId : solutionId;
        const jumpToAntiText = isSolution ? `Jump to puzzle` : `Jump to solution`;
        const jumpToAntiLink = `<a href="#${antiId}">${jumpToAntiText}</a>`;
        const parent = this;

        return /* html */ `
            <div class="paper" id="${id}">
                <h2>${puzzleTitle}</h2>
                <table>
                    ${(function generateRows(puzzleOrSolution) {
                        var rows = '';
                        for (var j = 0; j < 9; j++) {
                            rows += parent.displayRow(puzzleOrSolution.getRow(j));
                        }
                        return rows;
                    })(puzzleOrSolution)}
                </table>
                ${this.getShowSolutions() ? jumpToAntiLink : ''}
            </div>
        `;
    }

    addPuzzleToPuzzlesContainer(pid, puzzle) {
        const puzzlesContainer = document.getElementById(PaperSudoku.ID_PUZZLES_CONTAINER);
        puzzlesContainer.innerHTML += this.displayPuzzle(pid, puzzle, false);
    }

    addSolutionToSolutionsContainer(pid, solution) {
        const solutionsContainer = document.getElementById(PaperSudoku.ID_SOLUTIONS_CONTAINER);
        solutionsContainer.innerHTML += this.displayPuzzle(pid, solution, true);
    }

    /**
     * Based on the configurations the user has set, generate and display requested puzzles.
     */
    generatePuzzles(shouldHardRegenerate) {
        if (shouldHardRegenerate) {
            this.puzzleCache = [];
            this.solutionCache = [];
        }

        this.setPaperSize(this.getPaperSize());

        const showSolutions = this.getShowSolutions();
        if (showSolutions) {
            this.showSolutionsHeader();
        }

        const puzzleCount = this.getPuzzleCount();

        // Generate `n` puzzles and display them and their solutions as configured
        for (var pid = 0; pid < puzzleCount; pid++) {
            const puzzle = this.#getCachedPuzzleOrMakeOne(pid);
            const solution = this.#getCachedSolutionOrMakeOne(pid);

            this.addPuzzleToPuzzlesContainer(pid, puzzle);
            if (showSolutions) {
                this.addSolutionToSolutionsContainer(pid, solution);
            }
        }
    }

    #getCachedPuzzleOrMakeOne(pid) {
        if (pid < this.puzzleCache.length) {
            return this.puzzleCache[pid];
        } else {
            const puzzle = this.generator.generate(
                this.getDifficulty(),
                this.getRequireSymmetry()
            );
            this.puzzleCache.push(puzzle);
            return puzzle;
        }
    }

    #getCachedSolutionOrMakeOne(pid) {
        if (pid < this.solutionCache.length) {
            return this.solutionCache[pid];
        } else {
            // TODO: this whole function is not great, especially this assumption. Redoing data structure will help
            const puzzle = this.puzzleCache[pid];
            const solution = this.solver.solve(puzzle);
            this.solutionCache.push(solution);
            return solution;
        }
    }
}

export { PaperSudoku };