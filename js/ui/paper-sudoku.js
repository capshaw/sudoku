/**
 * Acknowledging this is pretty hacky right now. Needs a few refactoring passes.
 */
class PaperSudoku {
    static HIDDEN_CLASS_NAME = 'hidden';
    static EMPTY_CONTAINER_STATE = '';

    constructor() {
        this.generator = SudokuGenerator();
        this.solver = SudokuSolver();
    }

    regenerateSudoku() {
        // TODO: container names as configuration somewhere
        const loadingPopover = document.getElementById('loadingPopover');
        const pagesContainer = document.getElementById('puzzlesContainer');
        const solutionsContainer = document.getElementById('solutionsContainer');
        const solutionsHeader = document.getElementById('solutionsHeader');
        
        // Reset the visibility of all containers and remove their content
        loadingPopover.classList.remove(PaperSudoku.HIDDEN_CLASS_NAME);
        solutionsHeader.classList.add(PaperSudoku.HIDDEN_CLASS_NAME);
        pagesContainer.innerHTML = PaperSudoku.EMPTY_CONTAINER_STATE;
        solutionsContainer.innerHTML = PaperSudoku.EMPTY_CONTAINER_STATE;

        // Generate the puzzles and set the correct visibility of various elements
        setTimeout(() => {
            this.generatePuzzles();
            loadingPopover.classList.add(PaperSudoku.HIDDEN_CLASS_NAME);
        }, 50);
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
            columns += `<td width="11.11%">${row[i] == -1 ? '&nbsp;' : row[i]}</td>`;
        }
        return columns;
    }

    /**
     * Given either a puzzle or a solution to a sudoku, returns an HTML representation of that 
     * puzzle or solution.
     */
    displayPuzzle(pid, puzzleOrSolution, isSolution, showSolutions) {
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
                ${showSolutions ? jumpToAntiLink : ''}
            </div>
        `;
    }

    /**
     * Based on the configurations the user has set, generate and display requested puzzles.
     */
    generatePuzzles() {
        const overallContainerElement = document.getElementById('overallContainer');
        const solutionsHeader = document.getElementById('solutionsHeader');
        const puzzlesContainer = document.getElementById('puzzlesContainer');
        const solutionsContainer = document.getElementById('solutionsContainer');

        // The DOM elements for the various configurations allowable
        const configurationNumPuzzlesElement = document.getElementById('configurationNumPuzzles');
        const configurationPaperSizeElement = document.getElementById('configurationPaperSize');
        const configurationShowSolutionsElement = document.getElementById('configurationShowSolutions');
        const configurationDifficultyElement = document.getElementById('configurationDifficulty');
        const configurationRequireSymmetryElement = document.getElementById('configurationRequireSymmetry');

        // The value of the configurations allowable
        const configurationNumPuzzles = parseInt(configurationNumPuzzlesElement.value);
        const configurationPaperSize = configurationPaperSizeElement.value;
        const configurationShowSolutions = configurationShowSolutionsElement.checked;
        const configurationDifficulty = new Difficulty(configurationDifficultyElement.value);
        const configurationRequireSymmetry = configurationRequireSymmetryElement.checked;

        // Modify visibility and shape of various elements based upon the configurations
        // TODO: make this more robust against 'paperset' name changes
        overallContainerElement.classList = `paperset size-${configurationPaperSize}`;
        if (configurationShowSolutions) {
            solutionsHeader.classList.remove(PaperSudoku.HIDDEN_CLASS_NAME);
        }

        // Generate `n` puzzles and display them and their solutions as configured
        for (var pid = 0; pid < configurationNumPuzzles; pid++) {
            const puzzle = this.generator.generate(configurationDifficulty, configurationRequireSymmetry);
            const solution = this.solver.solve(puzzle);

            puzzlesContainer.innerHTML += this.displayPuzzle(pid, puzzle, false, configurationShowSolutions);
            if (configurationShowSolutions) {
                solutionsContainer.innerHTML += this.displayPuzzle(pid, solution, true, configurationShowSolutions);
            }
        }
    }
}