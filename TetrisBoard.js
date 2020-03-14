'use strict';

import { Blocks, Colors } from './blocks';

console.log('TETRIS')


export default class TetrisBoard {
	constructor(canvas, sizeX, sizeY) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		this.points = 0;
		this.gameOver = false;

		// board
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.board = [...Array(sizeY)].map(e => Array(sizeX).fill(null));

		// current block
		this.currentBlock = this._nextBlock();
		console.log('initial block:', this.currentBlock)
	}

	handleInput(event) {
		switch (event.key) {
			case 'a':
			case 'ArrowLeft':
				if (this.currentBlock.x > 0)
					this.currentBlock.x -= 1;
				break;

			case 'd':
			case 'ArrowRight':
				if (this.currentBlock.x < this.sizeX - Blocks[this.currentBlock.type][0].length)
					this.currentBlock.x += 1;
				break;

			// case 's':  // never mind xD
			// case 'ArrowDown':

			// 	break;

			case 'q':
			case 'PageUp':
				this._rotate(false);
				break;

			case 'e':
			case 'PageDown':
				this._rotate(true);
				break;
		}

		this.update();
	}

	update() {
		if (this.gameOver) return false;

		if (this._checkCollision(this.currentBlock, 1)) {
			if (this.currentBlock.y === 0 && this.gameOver === false) {
				this.gameOver = true;
				console.log('Game over!');
				document.getElementById('game-over').classList.add('over');
			}

			this._applyBlock(this.currentBlock);
			this.points += this._removeFullLines();
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
			x: Math.floor(this.sizeX / 2) - 1,
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
					return matchingField !== null;
				}
			})
		);
	}

	_removeFullLines() {
		let lines = 0;
		this.board.forEach((row, y) => {
			console.log(row)
			const isFull = row.every(field => field !== null);
			if (isFull) {
				lines += 1;
				this.board.splice(y, 1);
				this.board.unshift(Array(this.sizeX));
			}
		});
		return lines;
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
