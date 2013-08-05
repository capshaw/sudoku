// The sudoku object handles the board, but no solving logic
// (or creation logic for that matter). If desired, use the helpers for that.
var SudokuGUI = function () {

    var init = function () {
        drawElements();
        bindElements();
    }

    var getTileSelectors = function () {
        tiles = {};
        for(var y = 0; y < 9; y++){
            tiles[y] = {}
            for(var x = 0; x < 9; x++){
                tiles[y][x] = $('#tile-' + x + '-' + y);
            }
        }
        return tiles;
    }

    var reloadElements = function () {
        return {
            dimension: 9,
            area: 81,
            board: $('#SudokuBoard'),
            squares: $('.sudoku-square'),
            tiles: $('.sudoku-tile'),
            xButton: $('#x'),
            BackContent: $('#BackContent'),
            toggleBackButtons: $('.toggle-back'),
            allBacks: $('.back div'),
            front: $('.front'),
            flipContainer: $('.flip-container'),
            toggleDropdown: $('#toggle-dropdown'),
            dropDown: $('#dropdown'),
            solveButton: $('#solveButton'),
            newPuzzleButton: $("#newPuzzleButton"),
            restartButton: $("#restartButton"),
            tileSelectors: getTileSelectors()
        }
    }

    var elements = reloadElements();

    var bindElements = function () {

        elements.solveButton.on("click", function(e) {
            e.preventDefault();
            hideAllBacks();
            sudokuGUI.showPuzzle(solver.solve(sudokuGUI.getPuzzle(), false));
            return false;
        });

        elements.newPuzzleButton.on("click", function(e) {
            e.preventDefault();
            hideAllBacks();
            var puzzle = generator.generate();
            sudokuGUI.showPuzzle(puzzle, true);
            return false;
        });

        elements.restartButton.on("click", function(e) {
            e.preventDefault();
            hideAllBacks();
            sudokuGUI.showPuzzle(generator.getLastGeneratedPuzzle(), false);
            return false;
        })

        elements.xButton.on("click", function(e){
            e.preventDefault();
            elements.BackContent.slideUp({
                easing: 'easeInOutCubic'
            });
            elements.allBacks.removeClass('showing');
            return false;
        });

        elements.toggleBackButtons.on("click", function (e) {
            e.preventDefault();
            var back = $('#' + $(this).attr('id') + '-content');
            if(back.hasClass('showing')) {
                return;
            }
            elements.allBacks.hide();
            elements.allBacks.removeClass('showing');
            back.show();
            back.addClass('showing');
            elements.BackContent.slideDown({
                easing: 'easeInOutCubic'
            })
            return false;
        });

        elements.toggleDropdown.on("click", function (e) {
            e.preventDefault();
            elements.toggleDropdown.toggleClass('enabled');
            elements.dropDown.toggle();
            return false;
        });

        // Separate function to handle numpads as well.
        elements.tiles.keypress(function(e){

            // Disable changes when disabled
            if($(this).hasClass('disabled')) {
                e.preventDefault();
                return false;
            }

            // Replace [1-9] in the input box
            if (e.keyCode <= 57 && e.keyCode >= 49) {
                e.preventDefault(e);
                $(this).val(String.fromCharCode(e.keyCode));
                onChangeHandler();
                return false;
            }
        });

        elements.tiles.keydown(function(e){

            // Arrow keys move cooresponding directions
            if (e.keyCode <= 40 && e.keyCode >= 37) {
                e.preventDefault(e);
                switch (e.keyCode) {
                    case 37: moveByVector($(this), -1,  0); break; // left
                    case 38: moveByVector($(this),  0, -1); break; // up
                    case 39: moveByVector($(this),  1,  0); break; // right
                    case 40: moveByVector($(this),  0,  1); break; // down
                }
                return false;
            }

            // Disable changes when disabled
            if($(this).hasClass('disabled')) {
                e.preventDefault();
                return false;
            }

            // Replace [1-9] in the input box
            if (e.keyCode <= 57 && e.keyCode >= 49) {
                e.preventDefault(e);
                $(this).val(String.fromCharCode(e.keyCode));
                onChangeHandler();
                return false;
            }

            // Delete
            if (e.keyCode == 8) {
                e.preventDefault(e);
                $(this).val("")
                onChangeHandler();
                return false;
            }
        });
    }

    var onChangeHandler = function(){
        var errors = verifier.verify(getPuzzle());
        showErrors(errors);
    };

    var showPuzzle = function (puzzle, firstTime) {
        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 9; x++) {
                set(x, y, puzzle.get(x,y));
                if(firstTime){
                    toggleDisabledState(x,y, (puzzle.get(x,y) != -1));
                }
            }
        }
    }

    var getPuzzle = function () {
        var puzzle = new Sudoku();
        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 9; x++){
                puzzle.set(x, y, get(x, y));
            }
        }
        return puzzle;
    }

    var drawElements = function () {

        elements = reloadElements();
        for(var i = 0; i < elements.dimension; i++) {
            generateNthSquare(i);
        }

        elements = reloadElements();
        for(var y = 0; y < elements.dimension; y++) {
            for(var x = 0; x < elements.dimension; x++) {
                generateXYthTile(x, y);
            }
        }

        elements = reloadElements();
    }

    var hideAllBacks = function () {
        elements.BackContent.slideUp({
            easing: 'easeInOutCubic'
        });
        elements.allBacks.removeClass('showing');
    }

    var get = function (x, y) {
        return elements.tileSelectors[y][x].val();
    }

    var set = function (x, y, value) {
        if(value == -1) value = "";
        elements.tileSelectors[y][x].val(value);
    }

    var toggleDisabledState = function (x, y, disabled) {
        // todo: see if we can avoid this selector
        var tile = elements.tileSelectors[y][x];
        if(disabled){
            tile.addClass('disabled');
        }else{
            tile.removeClass('disabled');
        }
    }

    var moveByVector = function (element, dx, dy) {
        var x = parseInt(element.attr('data-x'));
        var y = parseInt(element.attr('data-y'));
        x = mod((x + dx), elements.dimension);
        y = mod((y + dy), elements.dimension);
        elements.tileSelectors[y][x].focus();
    }

    // Modulo because javascript's '%' is remainder not modulo
    var mod = function (n, m) {
        var remain = n % m;
        return Math.floor(remain >= 0 ? remain : remain + m);
    };

    // Generate the nth square in [0-dimensions)
    var generateNthSquare = function (n) {
        var square = $('<div />', {
            class: 'sudoku-square',
        });

        elements.board.append(square);
    }

    var showErrors = function (problemTiles) {
        elements.tiles.removeClass('sudoku-tile-error')
        for(i in problemTiles) {
            var tile = problemTiles[i];
            elements.tileSelectors[tile.y][tile.x].addClass('sudoku-tile-error');
        }
    }

    var generateXYthTile = function (x, y) {

        var unique = x + y * elements.dimension;
        var bs = (x % 3) + (y % 3) * 3 + 1;

        var tile = $('<input />', {
            class: 'sudoku-tile input-fix',
            unselectable: 'on',
            readonly : 'readonly',
            value: '',
            id: 'tile-' + x + '-' + y
        });

        tile.attr('data-x', x);
        tile.attr('data-y', y);

        if(0 == x % 3){
            tile.addClass('edge-tile-left');
        }

        if(0 == y % 3){
            tile.addClass('edge-tile-top');
        }

        n = Math.floor(x / 3) + Math.floor(y / 3) * 3;
        $(elements.squares[n]).append(tile);
        return tile;
    }

    return {
        elements: elements,
        get: get,
        init: init,
        showErrors: showErrors,
        showPuzzle: showPuzzle,
        getPuzzle: getPuzzle
    }
}