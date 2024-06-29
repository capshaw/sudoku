import { Difficulty } from "../sudoku/Difficulty.js";
import { SudokuGenerator } from "../sudoku/SudokuGenerator.js";
import { SudokuSolver } from "../sudoku/SudokuSolver.js";

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

    static ID_CONFIG_NUM_PUZZLES = 'configurationNumPuzzles';
    static ID_CONFIG_PAPER_SIZE = 'configurationPaperSize';
    static ID_CONFIG_SHOW_SOLUTIONS = 'configurationShowSolutions';
    static ID_CONFIG_DIFFICULTY = 'configurationDifficulty';
    static ID_CONFIG_REQUIRE_SYMMETRY = 'configurationRequireSymmetry';

    constructor() {
        this.generator = new SudokuGenerator();
        this.solver = new SudokuSolver();
    }

    regenerateSudoku() {
        // Reset the visibility of all containers and remove their content
        this.hideSolutionsHeader();
        this.showLoadingPopover();
        this.emptyPuzzlesContainer();
        this.emptySolutionsContainer();

        // Generate the puzzles and set the correct visibility of various elements
        setTimeout(() => {
            this.generatePuzzles();
            this.hideLoadingPopover();
        }, 100);
    }

    getConfigurationNumPuzzles() {
        return parseInt(document.getElementById(PaperSudoku.ID_CONFIG_NUM_PUZZLES).value);
    }

    getConfigurationPaperSize() {
        return document.getElementById(PaperSudoku.ID_CONFIG_PAPER_SIZE).value;
    }

    getConfigurationShowSolutions() {
        return document.getElementById(PaperSudoku.ID_CONFIG_SHOW_SOLUTIONS).checked;
    }

    getConfigurationDifficulty() {
        return new Difficulty(document.getElementById(PaperSudoku.ID_CONFIG_DIFFICULTY).value);
    }

    getConfigurationRequireSymmetry() {
        return document.getElementById(PaperSudoku.ID_CONFIG_REQUIRE_SYMMETRY).checked;
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
        overallContainerElement.classList = `paperset size-${paperSize}`;
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

        return `
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
                ${this.getConfigurationShowSolutions() ? jumpToAntiLink : ''}
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
    generatePuzzles() {
        this.setPaperSize(this.getConfigurationPaperSize());

        const configurationShowSolutions = this.getConfigurationShowSolutions();
        if (configurationShowSolutions) {
            this.showSolutionsHeader();
        }

        const configurationNumPuzzles = this.getConfigurationNumPuzzles();
        const configurationDifficulty = this.getConfigurationDifficulty();
        const configurationRequireSymmetry = this.getConfigurationRequireSymmetry();

        // Generate `n` puzzles and display them and their solutions as configured
        for (var pid = 0; pid < configurationNumPuzzles; pid++) {
            const puzzle = this.generator.generate(configurationDifficulty, configurationRequireSymmetry);
            const solution = this.solver.solve(puzzle);

            this.addPuzzleToPuzzlesContainer(pid, puzzle);
            if (configurationShowSolutions) {
                this.addSolutionToSolutionsContainer(pid, solution);
            }
        }
    }
}

export { PaperSudoku };