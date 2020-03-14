'use strict';
import TetrisBoard from './TetrisBoard.js';
import './style.css';

/* TODO remove */
window.TetrisBoard = TetrisBoard;
// console.log(TetrisBoard)
/***/

// const GAME_DELAY = 200; /* ms */
const GAME_DELAY = 500; /* ms */
const BORAD_SIZE = { x: 10, y: 20 };


function init() {
	const playerCanvas = document.getElementById('player-tetris');
	const opponentCanvas = document.getElementById('player-tetris');

	const playerTetris = new TetrisBoard(playerCanvas, BORAD_SIZE.x, BORAD_SIZE.y);
	window.tetris = playerTetris;
	// const opponentTetris = new TetrisBoard(opponentCanvas, BORAD_SIZE.x, BORAD_SIZE.y);

	return [playerTetris];
	// return [playerTetris, opponentTetris];
}

function update(tetrisBoards) {
	tetrisBoards.forEach(tetris => tetris.update());
}


// Main
document.addEventListener("DOMContentLoaded", function (event) {
	const tetrisBoards = init();
	const playerTetris = tetrisBoards[0];
	// const opponentTetris = tetrisBoards[1];

	document.addEventListener('keydown', (event) => {
		// console.log('EVENT', event)
		playerTetris.handleInput(event);
	});

	setInterval(() => update(tetrisBoards), GAME_DELAY);
});
