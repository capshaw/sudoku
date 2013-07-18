var sudoku;
var verifier;
var generator;

$(document).ready(function(){

	sudokuGUI = SudokuGUI();
	generator = SudokuGenerator();
	verifier = SudokuVerifier();

	sudokuGUI.setOnChangeHandler(function(){
		var errors = verifier.verify(sudokuGUI);
		sudokuGUI.showErrors(errors);
	});
	sudokuGUI.init();

	var sudoku = generator.generate();
	sudokuGUI.showPuzzle(sudoku);

	// debug
	var errors = verifier.verify(sudoku);
	sudokuGUI.showErrors(errors);
})

// The sudoku object handles the board, but no solving logic
// (or creation logic for that matter). If desired, use the helpers for that.
var SudokuGUI = function () {

	var onChangeHandler = function () {}

	var setOnChangeHandler = function (f) {
		onChangeHandler = f;
	}

	var init = function () {
		drawElements();
		bindElements();
	}

	var showPuzzle = function (puzzle) {
		for(var y = 0; y < 9; y++) {
			for(var x = 0; x < 9; x++) {
				set(x, y, puzzle.get(x,y));
			}
		}
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
			dropDown: $('#dropdown')
		}
	}

	var elements = reloadElements();

	var bindElements = function () {

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
		// todo: see if we can avoid this selector
		$('#tile-' + x + '-' + y).val(value);
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

	//
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

		if(Math.floor(Math.random() * 2) == 0){
			tile.addClass('disabled');
		}

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
		setOnChangeHandler: setOnChangeHandler,
		showErrors: showErrors,
		showPuzzle: showPuzzle
	}
}

// A simple storage mechanism for an (x,y) pair.
var Tuple = function (xx, yy) {

	var x = xx;
	var y = yy;

	return {
		x: x,
		y: y
	}
}

// A container for a Sudoku puzzle.
var Sudoku = function () {

	var puzzle = {};

	var get = function (x, y) {
		if (puzzle[y] !== undefined && puzzle[y][x] !== undefined) {
			return puzzle[y][x];
		}
	}

	var set = function (x, y, v) {
		if(puzzle[y] == undefined) {
			puzzle[y] = {};
		}
		puzzle[y][x] = v;
	}

	return {
		set: set,
		get: get,
	}
}

// Generates a Sudoku puzzle
var SudokuGenerator = function () {

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
			var type = Math.floor((Math.random() * 3)); // 0 - 2
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

		return sudoku;
	}

	return {
		generate: generate
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

	var verify = function (sudoku) {

		var errors = [];

		for(var i = 0; i < 9; i++) {
			errors = errors.concat(verifyRow(sudoku, i));
		}

		for(var i = 0; i < 9; i++) {
			errors = errors.concat(verifyColumn(sudoku, i));
		}

		for(var x = 0; x < 3; x++) {
			for(var y = 0; y < 3; y++) {
				errors = errors.concat(verifySquare(sudoku, x*3, y*3));
			}
		}

		return errors;
	}

	var verifySquare = function (sudoku, x, y) {
		var square = getValueChecker();
		var errors = [];

		for(var dx = 0; dx < 3; dx++) {
			for(var dy = 0; dy < 3; dy++) {
				var val = sudoku.get(x + dx, y + dy);
				if(!val) continue;
				square[val].push(Tuple(x + dx, y + dy));
			}
		}

		for(var key in square) {
			var val = square[key];
			if(val.length > 1) {
				errors = errors.concat(val);
			}
		}

		return errors;
	}

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
