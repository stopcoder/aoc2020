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

	function bitset(b, m) {
		let ret = "";
		for (let i = 0; i < b.length; i++) {
			ret += (m[i] === "X" ? b[i] : m[i]);
		}
		return ret;
	}

	let sum = 0;

	let mem = {};
	let mask;
	for await (const line of rl) {
		if (line.indexOf("mask") === 0) {
			mask = line.substring(7);
		} else {
			let result = /^mem\[(\d+)\] = (\d+)$/.exec(line);
			let binary = parseInt(result[2], 10).toString(2);
			if (binary.length < 36) {
				binary = Array(36 - binary.length).fill(0).join("") + binary;
			}
			mem[result[1]] = parseInt(bitset(binary, mask), 2);
		}
	}

	sum = Object.values(mem).reduce((acc, n) => {
		return acc + n;
	}, 0);

	console.log(sum);
}


processLineByLine();
