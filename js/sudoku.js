var sudokuGUI;
var verifier;
var generator;
var solver;

$(document).ready(function(){

	sudokuGUI = SudokuGUI();
	generator = SudokuGenerator();
	verifier = SudokuVerifier();
	solver = SudokuSolver();

	sudokuGUI.init();

	var puzzle = generator.generate();
	sudokuGUI.showPuzzle(puzzle, true);
});

// The sudoku object handles the board, but no solving logic
// (or creation logic for that matter). If desired, use the helpers for that.
var SudokuGUI = function () {

	var init = function () {
		drawElements();
		bindElements();
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

	// Reloads all of the elements that are accessible via this object
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
			restartButton: $("#restartButton")
		}
	}

	var elements = reloadElements();

	var bindElements = function () {

		elements.solveButton.on("click", function(e) {
			e.preventDefault();
			// todo: better way to do this repeatedly in various click handlers
			// that will have it?
			elements.BackContent.slideUp({
				easing: 'easeInOutCubic'
			});
			elements.allBacks.removeClass('showing');
			sudokuGUI.showPuzzle(solver.solve(sudokuGUI.getPuzzle(), false));
			return false;
		});

		elements.newPuzzleButton.on("click", function(e) {
			e.preventDefault();
			var puzzle = generator.generate();
			sudokuGUI.showPuzzle(puzzle, true);
			return false;
		});

		elements.restartButton.on("click", function(e) {
			e.preventDefault();
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

	var get = function (x, y) {
		// todo: not this selector
		return $('#tile-' + x + '-' + y).val();
	}

	var set = function (x, y, value) {
		if(value == -1) value = "";
		// todo: see if we can avoid this selector
		$('#tile-' + x + '-' + y).val(value);
	}

	var toggleDisabledState = function (x, y, disabled) {
		// todo: see if we can avoid this selector
		var tile = $('#tile-' + x + '-' + y);
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
		// todo: not this selector
		$('#tile-' + x + '-' + y).focus();
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
			$('#tile-' + tile.x + '-' + tile.y).addClass('sudoku-tile-error');
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

// A simple storage mechanism for an (x,y) pair.
var Tuple = function (xx, yy, vv) {

	var x = xx;
	var y = yy;

	return {
		x: x,
		y: y
	}
}

// A container for a Sudoku puzzle.
var Sudoku = function () {

	var filledTiles = 0;
	var puzzle = {};

	var set = function (x, y, v) {
		if(get(x, y) == -1){
			filledTiles += 1;
		}
		if(v == -1) {
			filledTiles -= 1;
		}
		if(puzzle[y] == undefined) {
			puzzle[y] = {};
		}
		puzzle[y][x] = v;
	}

	var remove = function (x, y) {
		if (puzzle[y] !== undefined && puzzle[y][x] !== undefined) {
			filledTiles -= 1;
			puzzle[y][x] = -1;
		}
	}

	var get = function (x, y) {
		if (puzzle[y] !== undefined && puzzle[y][x] !== undefined) {
			return puzzle[y][x];
		}
		return -1;
	}

	var getRow = function (y) {
		if(puzzle[y] !== undefined) {
			return puzzle[y];
		}
		return {};
	}

	var getColumn = function (x) {
		var column = {};
		for(var y = 0; y < 9; y++){
			column[y] = get(x, y);
		}
		return column;
	}

	var getSquare = function (x, y) {
		var square = {};
		for(var dy = 0; dy < 3; dy++) {
			square[y * 3 + dy] = {};
			for(var dx = 0; dx < 3; dx++) {
				tuple = Tuple(x * 3 + dx, y * 3 + dy);
				square[tuple.y][tuple.x] = get(tuple.x, tuple.y);
			}
		}
		return square;
	}

	var getClone = function () {
		var clone = Sudoku();
		for(var y = 0; y < 9; y++) {
			for(var x = 0; x < 9; x++) {
				clone.set(x, y, get(x,y));
			}
		}
		return clone;
	}

	var getFilledTiles = function () {
		return filledTiles;
	}

	return {
		set: set,
		remove: remove,
		get: get,
		getRow: getRow,
		getColumn: getColumn,
		getSquare: getSquare,
		getClone: getClone,
		getFilledTiles: getFilledTiles
	}
}

// Generates a Sudoku puzzle
var SudokuGenerator = function () {

	var lastGeneratedPuzzle = new Sudoku();
	var sudokuTemplate = [
		[1, 2, 3, 4, 5, 6, 7, 8, 9],
		[4, 5, 6, 7, 8, 9, 1, 2, 3],
		[7, 8, 9, 1, 2, 3, 4, 5, 6],
		[2, 3, 4, 5, 6, 7, 8, 9, 1],
		[5, 6, 7, 8, 9, 1, 2, 3, 4],
		[8, 9, 1, 2, 3, 4, 5, 6, 7],
		[3, 4, 5, 6, 7, 8, 9, 1, 2],
		[6, 7, 8, 9, 1, 2, 3, 4, 5],
		[9, 1, 2, 3, 4, 5, 6, 7, 8]
	]

	var swapRows = function (puzzle, a, b) {
		var temp = puzzle[a];
		puzzle[a] = puzzle[b];
		puzzle[b] = temp;
		return puzzle;
	}

	var swapColumns = function (puzzle, a, b) {
		for(var i = 0; i < 9; i++){
			var temp = puzzle[i][a];
			puzzle[i][a] = puzzle[i][b];
			puzzle[i][b] = temp;
		}
		return puzzle;
	}

	var swapValues = function (puzzle, a, b) {
		for(var i = 0; i < 9; i++) {
			for(var j = 0; j < 9; j++) {
				var value = puzzle[i][j];
				if(value == a) {
					puzzle[i][j] = b;
				}
				if(value == b) {
					puzzle[i][j] = a;
				}
			}
		}
		return puzzle;
	}

	var choose = function (choices) {
		index = Math.floor(Math.random() * choices.length);
		return choices[index];
	}

	var generate = function () {
		var puzzle = $.extend(true, {}, sudokuTemplate);

		for(var i = 0; i < 1000; i++) {

			// Pick a random type of swapping to do.
			var type = Math.floor((Math.random() * 3)); // 0 - 2

			// Random numbers in the specified ranges.
			var a = Math.floor((Math.random() * 9));	// 0 - 8
			var c = Math.floor((Math.random() * 9));	// 0 - 8
			var v = Math.floor((Math.random() * 3));	// 0 - 2
			var b = Math.floor(a/3) * 3 + v;

			switch(type){
				case 0: puzzle = swapRows(puzzle, a, b); break;
				case 1: puzzle = swapColumns(puzzle, a, b); break;
				case 2: puzzle = swapValues(puzzle, a + 1, c + 1); break;
			}
		}

		var sudoku = new Sudoku();
		for(var y = 0; y < 9; y++) {
			for(var x = 0; x < 9; x++) {
				sudoku.set(x, y, puzzle[y][x])
			}
		}

		for(var retries = 0; retries < 10; retries++){
			var lastRemovedValues = {};
			while(solver.isSolvable(sudoku)) {
				var x = Math.floor((Math.random() * 9));
				var y = Math.floor((Math.random() * 9));
				var nx = 8 - x;
				var ny = 8 - y;

				lastRemovedValues = {};
				lastRemovedValues[y] = {};
				lastRemovedValues[ny] = {};

				lastRemovedValues[y][x] = sudoku.get(x, y);
				lastRemovedValues[ny][nx] = sudoku.get(nx, ny);

				sudoku.remove(x, y);
				sudoku.remove(nx, ny);
			}

			for(var y in lastRemovedValues){
				for(var x in lastRemovedValues[y]){
					sudoku.set(x, y, lastRemovedValues[y][x]);
				}
			}
		}

		lastGeneratedPuzzle = sudoku.getClone();
		return sudoku;
	}

	var getLastGeneratedPuzzle = function () {
		return lastGeneratedPuzzle;
	}

	return {
		generate: generate,
		getLastGeneratedPuzzle: getLastGeneratedPuzzle
	}
}

// Given a sudoku object, finds problems associated with it.
var SudokuVerifier = function () {

	var getValueChecker = function () {
		var checker = {}
		for(var i = 0; i < 9; i++) {
			checker[i + 1] = []
		}
		return checker;
	}

	var verify = function (puzzle) {

		var errors = [];

		for(var i = 0; i < 9; i++) {
			errors = errors.concat(verifyRow(puzzle, i));
		}

		for(var i = 0; i < 9; i++) {
			errors = errors.concat(verifyColumn(puzzle, i));
		}

		for(var x = 0; x < 3; x++) {
			for(var y = 0; y < 3; y++) {
				errors = errors.concat(verifySquare(puzzle, x*3, y*3));
			}
		}

		return errors;
	}

	// todo: refactor using new getSquare
	var verifySquare = function (puzzle, x, y) {
		var checker = getValueChecker();
		var errors = [];

		for(var dx = 0; dx < 3; dx++) {
			for(var dy = 0; dy < 3; dy++) {
				var val = puzzle.get(x + dx, y + dy);
				if(!val) continue;
				checker[val].push(Tuple(x + dx, y + dy));
			}
		}

		for(var key in checker) {
			var val = checker[key];
			if(val.length > 1) {
				errors = errors.concat(val);
			}
		}

		return errors;
	}

	// todo: refactor using new getRow
	var verifyRow = function (sudoku, i) {
		var row = getValueChecker();
		var errors = [];

		for(var j = 0; j < 9; j++) {
			var val = sudoku.get(j, i);
			if(!val) continue;
			row[val].push(Tuple(j, i));
		}

		for(var key in row) {
			var val = row[key];
			if(val.length > 1) {
				errors = errors.concat(val);
			}
		}

		return errors;
	}

	// todo: refactor using new getColumn
	var verifyColumn = function (sudoku, i) {
		var column = getValueChecker();
		var errors = [];

		for(var j = 0; j < 9; j++) {
			var val = sudoku.get(i, j);
			if(!val) continue;
			column[val].push(Tuple(i, j));
		}

		for(var key in column) {
			var val = column[key];
			if(val.length > 1) {
				errors = errors.concat(val);
			}
		}

		return errors;
	}

	return {
		verify: verify
	}
}

// Profides functionality for solving a sudoku puzzle.
var SudokuSolver = function () {

	var isSolvable = function (puzzle) {
		var clone = solve(puzzle);
		return (clone.getFilledTiles() == 81);
	}

	var solve = function (puzzle) {

		var clone = puzzle.getClone();

		var lastFilledTileCount;
		do {
			lastFilledTileCount = clone.getFilledTiles();

			var columns = [];
			for(var j = 0; j < 9; j++){
				columns.push(clone.getColumn(j));
			}

			var rows = [];
			for(var i = 0; i < 9; i++){
				rows.push(clone.getRow(i));
			}

			var squares = [];
			for(var y = 0; y < 3; y++){
				for(var x = 0; x < 3; x++){
					squares.push(clone.getSquare(x, y));
				}
			}

			for(var y = 0; y < 9; y++) {
				for(var x = 0; x < 9; x++) {

					if(clone.get(x, y) > 0 && clone.get(x, y) < 9){
						continue;
					}

					// Set every digit to be available.
					var choices = [0,0,0,0,0,0,0,0,0];
					var row = rows[y];
					var column = columns[x];
					var square = squares[Math.floor(x/3) + Math.floor(y/3) * 3]

					// Mark used digits
					var pos;
					for(pos in row){
						choices[row[pos] - 1] = 1;
					}
					for(pos in column){
						choices[column[pos] - 1] = 1;
					}
					for(yy in square){
						for(xx in square[yy]){
							choices[square[yy][xx] - 1] = 1;
						}
					}

					// Process to see what remains.
					possibleAnswers = [];
					for(var h = 0; h < 9; h++){
						if(choices[h] == 0){
							possibleAnswers.push(h + 1);
						}
					}

					// Set at answer if only one choice remains.
					if(possibleAnswers.length == 1){
						clone.set(x, y, possibleAnswers[0]);
					}
				}
			}
		} while (lastFilledTileCount < clone.getFilledTiles());

		return clone;
	}

	return {
		isSolvable: isSolvable,
		solve: solve
	}
}
