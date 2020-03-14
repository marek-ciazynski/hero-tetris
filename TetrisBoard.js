'use strict';

import { Blocks, Colors } from './blocks';

console.log('TETRIS')

const Actions = {
	LEFT: 0,
	RIGHT: 1,
	DROP: 2
}


/* TODO remove */
window.Blocks = Blocks;
window.Colors = Colors;
/***/

export default class TetrisBoard {
	constructor(canvas, sizeX, sizeY) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		// board
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.board = [...Array(sizeY)].map(e => Array(sizeX));

		/* TODO remove */
		// this.board[6][3] = Colors[0];
		// console.log(this.board)

		// current block
		this.currentBlock = this._nextBlock();
		console.log('initial block:', this.currentBlock)
	}

	handleInput(event) {
		const keyBinding = {
			'a': Actions.LEFT,
			'ArrowLeft': Actions.LEFT,

			'd': Actions.RIGHT,
			'ArrowRight': Actions.RIGHT,

			's': Actions.DROP,
			'ArrowDown': Actions.DROP,
		};

		const action = keyBinding[event.key];
		if (action !== undefined) {
			if (action === Actions.DROP) {
				this._fastDrop(this.currentBlock);
			} else {
				this._rotate(!!action);
			}
		}

		this.update();
	}

	update() {
		if (this._checkCollision(this.currentBlock, 1)) {
			this._applyBlock(this.currentBlock);
			this.currentBlock = this._nextBlock();
		} else {
			this.currentBlock.y += 1;
		}
		
		this.draw();
	}

	draw() {
		// clear canvas
		this.ctx.clearRect(0, 0, this.sizeX, this.sizeY);

		// draw board
		this.board.forEach((row, y) => {
			row.forEach((fieldColor, x) => {
				if (fieldColor) {
					this.ctx.fillStyle = fieldColor;
					this.ctx.fillRect(x, y, 1, 1);
				}
			});
		});

		// draw current block
		const blockGeom = Blocks[this.currentBlock.type];
		blockGeom.forEach((row, y) => {
			Array.from(row).forEach((point, x) => {
				if (point !== ' ') {
					this.ctx.fillStyle = Colors[this.currentBlock.color];
					this.ctx.fillRect(this.currentBlock.x + x, this.currentBlock.y + y, 1, 1);
				}
			});
		});
	}

	// private methods
	_randomKeyFromObject(obj) {
		const objKeys = Object.keys(obj);
		const index = Math.floor(Math.random() * objKeys.length);
		const key = objKeys[index]
		// return obj[key];
		return key;
	}

	_nextBlock() {
		return {
			type: this._randomKeyFromObject(Blocks),
			color: this._randomKeyFromObject(Colors),
			x: Math.floor(this.sizeX / 2) - 2,
			y: 0
		}
	}

	_checkCollision(block, offsetY = 0) {
		const blockGeom = Blocks[block.type];
		if (block.y + blockGeom.length + 1 > this.sizeY)
			return true;

		return blockGeom.some((row, y) =>
			Array.from(row).some((point, x) => {
				if (point !== ' ') {
					const matchingField = this.board[block.y + y + offsetY][block.x + x];
					return matchingField !== undefined;
				}
			})
		);
	}

	_applyBlock(block) {
		const blockGeom = Blocks[block.type];
		blockGeom.forEach((row, y) => {
			Array.from(row).forEach((point, x) => {
				if (point !== ' ')
					this.board[block.y + y][block.x + x] = Colors[block.color];
			});
		});
		return false;
	}

	_rotate(block, clockwise = true) {
		// this.currentBlock.type = ?? this._transpoze???
	}

	_transpoze(block) {
		return block[0].map((col, i) => block.map(row => row[i]));
	}

	_fastDrop(block) {

	}
}
