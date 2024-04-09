const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const directions4 = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];

	const directions8 = [
		[1, 0],
		[1, 1],
		[1, -1],
		[0, 1],
		[0, -1],
		[-1, 1],
		[-1, 0],
		[-1, -1]
	];

	const directions26 = [
		[1, 0, 0],
		[1, 1, 0],
		[1, -1, 0],
		[1, 0, 1],
		[1, 1, 1],
		[1, -1, 1],
		[1, 0, -1],
		[1, 1, -1],
		[1, -1, -1],
		[0, 1, 0],
		[0, -1, 0],
		[0, 1, 1],
		[0, -1, 1],
		[0, 0, 1],
		[0, 1, -1],
		[0, -1, -1],
		[0, 0, -1],
		[-1, 1, 0],
		[-1, 0, 0],
		[-1, -1, 0],
		[-1, 1, 1],
		[-1, 0, 1],
		[-1, -1, 1],
		[-1, 1, -1],
		[-1, 0, -1],
		[-1, -1, -1]
	];

	const zLayer = {0: []};

	for await (const line of rl) {
		zLayer[0].push(line.split(""));
	}

	function get(arr) {
		const coord = zLayer[arr[2]];
		if (coord) {
			if (arr[0] >= 0 && arr[0] < coord.length && arr[1] >= 0 && arr[1] < coord[arr[0]].length) {
				return coord[arr[0]][arr[1]];
			} else {
				return ".";
			}
		} else {
			return ".";
		}
	}

	function set(arr, value) {
		let coord = zLayer[arr[2]];
		if (!coord) {
			coord = new Array(zLayer[0].length);
			for (let i = 0 ; i < coord.length; i++) {
				coord[i] = new Array(zLayer[0][0].length).fill(".");
			}
			zLayer[arr[2]] = coord;
		}
		coord[arr[0]][arr[1]] = value;
	}

	function expand() {
		Object.keys(zLayer).forEach(z => {
			let coord = zLayer[z];
			coord.forEach(row => {
				row.push(".");
				row.unshift(".");
			});
			coord.push(new Array(coord[0].length).fill("."));
			coord.unshift(new Array(coord[0].length).fill("."));
		});

		let keys = Object.keys(zLayer).map(e => parseInt(e, 10));
		let min  = Math.min.apply(null, keys);
		let max = Math.max.apply(null, keys);

		let coord = new Array(zLayer[0].length);
		for (let i = 0 ; i < coord.length; i++) {
			coord[i] = new Array(zLayer[0][0].length).fill(".");
		}
		zLayer[min - 1] = coord;

		coord = new Array(zLayer[0].length);
		for (let i = 0 ; i < coord.length; i++) {
			coord[i] = new Array(zLayer[0][0].length).fill(".");
		}
		zLayer[max + 1] = coord;
	}

	const cycle = 6;

	for (let i = 0; i< cycle; i++) {
		expand();
		let changes = [];

		Object.keys(zLayer).forEach(z => {
			z = parseInt(z, 10);
			for (let x = 0; x < zLayer[0].length; x++) {
				for (let y = 0; y < zLayer[0][x].length; y++) {
					let count = 0;
					directions26.forEach(arr => {
						let value = get([x + arr[0], y + arr[1], z + arr[2]]);
						if (value === "#") {
							count++;
						}
					});

					let v = get([x, y, z]);

					if (v === "#" && (count !== 2 && count !== 3)) {
						changes.push([x, y, z]);
					} else if (v === "." && count === 3) {
						changes.push([x, y, z]);
					}
				}
			}
		});

		changes.forEach(c => {
			let value = get(c);

			set(c, value === "#" ? "." : "#");
		});
	}

	let sum = 0;

	Object.keys(zLayer).forEach(z => {
		let coord = zLayer[z];
		coord.forEach(y => {
			y.forEach(e => {
				if (e === "#") {
					sum++;
				}
			})
		});
	});

	console.log(sum);
}

processLineByLine();
