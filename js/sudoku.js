var sudoku;

$(document).ready(function(){
	sudoku = Sudoku();
	sudoku.init();
})

// The sudoku object handles the board, but no solving logic
// (or creation logic for that matter). If desired, use the helpers for that.
var Sudoku = function () {

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

			// Replace [1-9] in the input box
			if (e.keyCode <= 57 && e.keyCode >= 49) {
				$(this).val(String.fromCharCode(e.keyCode));
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

	var moveByVector = function (element, dx, dy) {
		var x = parseInt(element.attr('data-x'));
		var y = parseInt(element.attr('data-y'));

		x = mod((x + dx), elements.dimension);
		y = mod((y + dy), elements.dimension);
		//TODO: replace this selector
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

	//
	var generateXYthTile = function (x, y) {

		var unique = x + y * elements.dimension;
		var bs = (x % 3) + (y % 3) * 3 + 1;

		var tile = $('<input />', {
			class: 'sudokuTile inputFix',
			unselectable: 'on',
			value: bs,
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
		init: init
	}
}