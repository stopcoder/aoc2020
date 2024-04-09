const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const directions = [
		[1, 0],
		[1, 1],
		[1, -1],
		[0, 1],
		[0, -1],
		[-1, 1],
		[-1, 0],
		[-1, -1]
	];

	const grid = [];

	for await (const line of rl) {
		grid.push(line.split(""));
	}

	while(true) {
		const changes = [];

		for (let i = 0; i< grid.length; i++) {
			for (let j = 0; j< grid[i].length; j++) {
				let current = grid[i][j];
				if (current === "L" || current === "#") {
					let n_occupied = 0;
					directions.forEach(d => {
						let x = i + d[0];
						let y = j + d[1];
						if (x >= 0 && x < grid.length && y >= 0 && y < grid[x].length) {
							if (grid[x][y] === "#") {
								n_occupied++;
							}
						}
					});

					if (current === "L" && n_occupied === 0) {
						changes.push([i, j]);
					} else if (current === "#" && n_occupied >= 4) {
						changes.push([i, j]);
					}
				}
			}
		}

		if (changes.length === 0) {
			break;
		}

		changes.forEach(change => {
			grid[change[0]][change[1]] = (grid[change[0]][change[1]] === "L" ? "#" : "L");
		});
	}


	let count = 0;
	for (let i = 0; i< grid.length; i++) {
		for (let j = 0; j< grid[i].length; j++) {
			if (grid[i][j] === "#") {
				count++;
			}
		}
	}
	console.log(count);
}


processLineByLine();
