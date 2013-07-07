var sudoku;
var verifier;
var generator;

$(document).ready(function(){
	sudoku = Sudoku();
	generator = SudokuGenerator();
	verifier = SudokuVerifier();

	sudoku.setOnChangeHandler(function(){
		var errors = verifier.verify(sudoku);
		sudoku.showErrors(errors);
	});
	sudoku.init();

	var rows = generator.generate();
	sudoku.showPuzzle(rows);

	// debug
	var errors = verifier.verify(sudoku);
	sudoku.showErrors(errors);
})

// The sudoku object handles the board, but no solving logic
// (or creation logic for that matter). If desired, use the helpers for that.
var Sudoku = function () {

	var onChangeHandler = function () {}

	var setOnChangeHandler = function (f) {
		onChangeHandler = f;
	}

	var init = function () {
		drawElements();
		bindElements();
	}

	var showPuzzle = function (puzzle) {
		for(var y = 0; y < puzzle.length; y++) {
			for(var x = 0; x < puzzle[y].length; x++) {
				set(x, y, puzzle[y][x]);
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
			squares: $('.sudokuSquare'),
			tiles: $('.sudokuTile')
		}
	}

	var elements = reloadElements();

	var bindElements = function () {
		elements.tiles.keypress(function(e){

			// Delete
			if (e.keyCode == 8) {
				e.preventDefault();
				$(this).val("")
				onChangeHandler();
				return false;
			}

			// Replace [1-9] in the input box
			if (e.keyCode <= 57 && e.keyCode >= 49) {
				e.preventDefault();
				$(this).val(String.fromCharCode(e.keyCode));
				onChangeHandler();
				return false;
			}

			// Arrow keys move cooresponding directions
			if (e.keyCode <= 40 && e.keyCode >= 37) {
				e.preventDefault();
				switch (e.keyCode) {
					case 37: moveByVector($(this), -1,  0); break; // left
					case 38: moveByVector($(this),  0, -1); break; // up
					case 39: moveByVector($(this),  1,  0); break; // right
					case 40: moveByVector($(this),  0,  1); break; // down
				}
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
			class: 'sudokuSquare'
		});

		elements.board.append(square);
	}

	var showErrors = function (problemTiles) {
		elements.tiles.removeClass('sudokuTileError')
		for(i in problemTiles) {
			var tile = problemTiles[i];
			$('#tile-' + tile.x + '-' + tile.y).addClass('sudokuTileError');
		}
	}

	//
	var generateXYthTile = function (x, y) {

		var unique = x + y * elements.dimension;
		var bs = (x % 3) + (y % 3) * 3 + 1;

		var tile = $('<input />', {
			class: 'sudokuTile inputFix',
			unselectable: 'on',
			value: '',
			id: 'tile-' + x + '-' + y
		});

		tile.attr('data-x', x);
		tile.attr('data-y', y);

		if(0 == x % 3){
			tile.addClass('edgeTileLeft');
		}

		if(0 == y % 3){
			tile.addClass('edgeTileTop');
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

// Generates a Sudoku puzzle
var SudokuGenerator = function () {

	var shuffle = function (array) {
    	var counter = array.length, temp, index;

    	// While there are elements in the array
    	while (counter > 0) {
       		// Pick a random index
        	index = (Math.random() * counter--) | 0;

        	// And swap the last element with it
        	temp = array[counter];
        	array[counter] = array[index];
        	array[index] = temp;
    	}

    	return array;
	}

	var lastGenerated = [];

	var generate = function () {
		var rows = [];
		for(var i = 0; i < 9; i++) {
			var row = shuffle([1,2,3,4,5,6,7,8,9])
			rows.push(row);
		}
		lastGenerated = rows;
		return rows;
	}

	return {
		generate: generate,
		lastGenerated: lastGenerated
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
			errors = errors.concat(verifyRow(i));
		}

		for(var i = 0; i < 9; i++) {
			errors = errors.concat(verifyColumn(i));
		}

		for(var x = 0; x < 3; x++) {
			for(var y = 0; y < 3; y++) {
				errors = errors.concat(verifySquare(x*3, y*3));
			}
		}

		return errors;
	}

	var verifySquare = function (x, y) {
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

	var verifyRow = function (i) {
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

	var verifyColumn = function (i) {
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