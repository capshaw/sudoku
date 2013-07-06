var sudoku;
var verifier;

$(document).ready(function(){
	sudoku = Sudoku();
	verifier = SudokuVerifier();

	sudoku.setOnChangeHandler(function(){
		var errors = verifier.verify(sudoku);
		sudoku.showErrors(errors);
	});
	sudoku.init();
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
		elements.tiles.keydown(function(e){

			// Delete
			if (e.keyCode == 8) {
				e.preventDefault();
				$(this).val("")
				onChangeHandler();
				return false;
			}

			// Replace [1-9] in the input box
			if (e.keyCode <= 57 && e.keyCode >= 49) {
				$(this).val(String.fromCharCode(e.keyCode));
				onChangeHandler();
			}

			// Arrow keys move cooresponding directions
			if (e.keyCode <= 40 && e.keyCode >= 37) {
				switch (e.keyCode) {
					case 37: moveByVector($(this), -1,  0); break; // left
					case 38: moveByVector($(this),  0, -1); break; // up
					case 39: moveByVector($(this),  1,  0); break; // right
					case 40: moveByVector($(this),  0,  1); break; // down
				}
			}
		});
	}

	var get = function (x, y) {
		// todo: not this selector
		return $('#tile-' + x + '-' + y).val();
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
		showErrors: showErrors
	}
}

var Tuple = function (xx, yy) {

	var x = xx;
	var y = yy;

	return {
		x: x,
		y: y
	}

}

// Given a sudoku object, finds problems associated with it.
var SudokuVerifier = function () {

	var getValueChecker = function () {
		var checker = {}
		for(var i = 0; i < 9; i++) {
			checker[i] = []
		}
		return checker;
	}

	var verify = function (sudoku) {

		var errors = [];

		// Check rows
		// todo: refactor this nonsense
		for(var i = 0; i < 9; i++) {
			row = getValueChecker();
			for(var j = 0; j < 9; j++) {
				var val = sudoku.get(j, i);
				if(!val) {
					continue;
				}
				row[val].push(Tuple(j, i));
			}
			for(var key in row) {
				var val = row[key];
				if(val.length > 1) {
					errors = errors.concat(val);
				}
			}
		}

		// Check columns
		// Check squares
		//console.log("verifying")
		//console.log(errors);
		return errors;
	}

	return {
		verify: verify
	}
}