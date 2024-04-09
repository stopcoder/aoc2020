const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const tiles = [];

	for await (const line of rl) {
		let pos = 0;
		let res = [];
		while (pos < line.length) {
			let char = line.charAt(pos);
			if (char === "s" || char === "n") {
				res.push(line.substring(pos, pos + 2));
				pos += 2;
			} else {
				res.push(char);
				pos++;
			}
		}
		tiles.push(res);
	}

	let map = {};


	for (let i = 0; i< tiles.length; i++) {
		let x = 0, y = 0;
		tiles[i].forEach(s => {
			switch (s) {
				case "w":
					x -= 2;
					break;
				case "e":
					x += 2;
					break;
				case "sw":
					x--;
					y++;
					break;
				case "se":
					x++;
					y++;
					break;
				case "nw":
					x--;
					y--;
					break;
				case "ne":
					x++;
					y--;
					break;
			}
		});

		let key = x + ":" + y;
		map[key] = !map[key];
	}

	let sum = 0;
	let minX = Number.MAX_SAFE_INTEGER;
	let maxX = -Number.MAX_SAFE_INTEGER;
	let minY = Number.MAX_SAFE_INTEGER;
	let maxY = -Number.MAX_SAFE_INTEGER;
	Object.keys(map).forEach(key => {
		if (map[key]) {
			sum++;
			let parts = key.split(":").map(e => parseInt(e, 10));
			maxX = Math.max(parts[0], maxX);
			minX = Math.min(parts[0], minX);
			maxY = Math.max(parts[1], maxY);
			minY = Math.min(parts[1], minY);
		}
	});

	console.log(sum);

	let round = 0;
	let startX = minX - 2;
	let endX = maxX + 2;
	let startY = minY - 1;
	let endY = maxY + 1;

	let directions = [
		[2, 0],
		[-2, 0],
		[1, -1],
		[1, 1],
		[-1, 1],
		[-1, -1]
	];
	while (round < 100) {
		round++;

		let changes = [];
		for (let x = startX; x <= endX; x++) {
			for (let y = startY; y <= endY; y++) {
				if (Math.abs(x % 2) !== Math.abs(y % 2)) {
					continue;
				}

				let blacks = 0;
				directions.forEach(d => {
					let key = (x + d[0]) + ":" + (y + d[1]);
					if (map[key]) {
						blacks++;
					}
				});

				if (map[x+":"+y]) {
					if (blacks === 0 || blacks > 2) {
						changes.push(x+":"+y);
					}
				} else {
					if (blacks === 2) {
						changes.push(x+":"+y);
					}
				}
			}
		}
		changes.forEach(key => {
			map[key] = !map[key];
		});

		startX -= 2;
		endX += 2;
		startY -= 1;
		endY += 1;

		sum = 0;
		Object.keys(map).forEach(key => {
			if (map[key]) {
				sum++;
			}
		});
		console.log(`round ${round}: ${sum}`);
	}

	sum = 0;
	Object.keys(map).forEach(key => {
		if (map[key]) {
			sum++;
		}
	});

	console.log(sum);
}


processLineByLine();
