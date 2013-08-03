var sudokuGUI;
var generator;
var verifier;
var solver;

// Load modules in order and execute.
head.js("js/util/tuple.js", "js/sudoku/sudoku.js",
        "js/sudoku/value-checker.js", "js/sudoku/generator.js",
        "js/sudoku/solver.js", "js/sudoku/verifier.js", "js/sudoku/view.js",
        function() {

    $(document).ready(function(){

        sudokuGUI = SudokuGUI();
        generator = SudokuGenerator();
        verifier = SudokuVerifier();
        solver = SudokuSolver();

        sudokuGUI.init();

        var puzzle = generator.generate();
        sudokuGUI.showPuzzle(puzzle, true);
    });
});
