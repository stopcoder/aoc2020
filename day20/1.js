const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input1');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});


	const tiles = {};

	let tile;
	let num;

	for await (const line of rl) {
		if (line === "") {
			if (tile) {
				tiles[num] = tile;
			}
			tile = [];
		} else if (line.indexOf("Tile") !== -1) {
			num = parseInt(line.substring(5, 9), 10);
		} else {
			tile.push(line.split(""));
		}
	}
	tiles[num] = tile;


	// [top, right, bottom, left]
	const borders = {};

	const names = Object.keys(tiles);

	names.forEach(name => {
		tile = tiles[name];
		borders[name] = [tile[0], undefined, tile[tile.length -1].slice().reverse(), undefined];
		const firstColumn = [];
		const lastColumn = [];
		tile.forEach(row => {
			firstColumn.push(row[0]);
			lastColumn.push(row[row.length - 1]);
		});
		firstColumn.reverse();
		borders[name][3] = firstColumn;
		borders[name][1] = lastColumn;
	});

	function arrayEqual(a1, a2) {
		return a1.every((e, i) => e === a2[i]);
	}

	function match(name1, name2) {
		const border1 = borders[name1];
		const border2 = borders[name2];

		for (let i = 0; i < border1.length; i++) {
			for (let j = 0; j < border2.length; j++) {
				if (arrayEqual(border1[i], border2[j])) {
					return [i, j, 0];
				} else if (arrayEqual(border1[i], border2[j].reverse())) {
					return [i, j, 1]
				}
			}
		}
	}

	const neighbours = {};

	for (let i = 0; i < names.length - 1; i++) {
		for (let j = 0; j < names.length; j++) {
			if (i === j) {
				continue;
			}

			let matchResult = match(names[i], names[j]);

			if (matchResult) {
				neighbours[names[i]] ??= {};
				neighbours[names[j]] ??= {};

				neighbours[names[i]][names[j]] = matchResult;
				neighbours[names[j]][names[i]] = [matchResult[1], matchResult[0], matchResult[2]];
			}
		}
	}

	console.log(neighbours);

	let result = 1;
	let group = [[], [], []];
	Object.keys(neighbours).forEach(tileName => {
		const ns = Object.keys(neighbours[tileName]);
		group[ns.length - 2].push(tileName);
		if (ns.length === 2) {
			result *= parseInt(tileName, 10);
		}
	});

	console.log(result);



	/*
	const arr = new Array(12);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(12).fill(-1);
	}

	let rest = names.reduce((acc, name) => {
		acc[name] = true;
		return acc;
	}, {});

	arr[0][0] = group[0][0];
	delete rest[arr[0][0]];

	let diag = 0;

	function common(coord1, coord2, nsCount) {
		let n1, n2;
		if (coord1[0] >= 0 && coord1[0] < 12 && coord1[1] >=0 && coord1[1] < 12) {
			n1 = Object.keys(neighbours[arr[coord1[0]][coord1[1]]]);
		} else {
			n1 = [];
		}

		if (coord2[0] >= 0 && coord2[0] < 12 && coord2[1] >=0 && coord2[1] < 12) {
			n2 = Object.keys(neighbours[arr[coord2[0]][coord2[1]]]);
		} else {
			n2 = [];
		}

		if (n1.length > 0 && n2.length > 0) {
			return n1.find(e => {
				return (rest[e] && Object.keys(neighbours[e]).length === nsCount && n2.indexOf(e) !== -1);
			});
		} else {
			let n = n1.length > 0 ? n1 : n2;
			return n.find(e => {
				return (rest[e] && Object.keys(neighbours[e]).length === nsCount);
			});
		}
	}

	while (Object.keys(rest).length > 0) {
		diag++;

		for (let x = 0; x < diag + 1; x++) {
			let y = diag - x;

			if (y > 11 || x > 11) {
				continue;
			}

			let nsCount;
			if ((x === 0 || x === 11) && (y === 0 || y === 11)) {
				nsCount = 2;
			} else if ((x === 0 || x === 11) || (y === 0 || y === 11)) {
				nsCount = 3;
			} else {
				nsCount = 4;
			}
			arr[x][y] = common([x - 1, y], [x, y - 1], nsCount);
			delete rest[arr[x][y]];
		}
	}

	console.log(arr);

	// [top, bottom, left, right]
	// [a,b] [a, b+1] => [3, 2, 0]
	// [a,b] [a+1, b] => [1, 0, 0]

	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			// rotate the 4 times plus flip
			// test
			//  * i, j = 0: (i, j+1) and (i+1, j)
			//  * i = 0: (i, j - 1)
			//  * j = 0: (i - 1, j)
			//  * (i, j - 1) and ( i - 1, j)
		}
	}
	*/

}





processLineByLine();
