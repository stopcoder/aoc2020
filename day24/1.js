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
	Object.keys(map).forEach(key => {
		if (map[key]) {
			sum++;
		}
	});

	console.log(sum);
}


processLineByLine();
