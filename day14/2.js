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
		let i;
		let count = 0;
		let ret = [];
		for (i = 0; i < m.length; i++) {
			if (m[i] === "X") {
				count++;
			}
		}

		let template = "";
		for (let j = 0; j < b.length; j++) {
			if (m[j] === "0") {
				template += b[j];
			} else {
				template += m[j];
			}
		}

		const limit = Math.pow(2, count);
		for (i = 0; i < limit; i++) {
			let address = "";
			let selection = i.toString(2);
			selection = Array(count - selection.length).fill(0).join("") + selection;
			let pointer = 0;

			for (let j = 0; j < template.length; j++) {
				if (template[j] === "X") {
					address += selection[pointer];
					pointer++;
				} else {
					address += template[j];
				}
			}
			ret.push(address);
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
			let binary = parseInt(result[1], 10).toString(2);
			if (binary.length < 36) {
				binary = Array(36 - binary.length).fill(0).join("") + binary;
			}
			let adds = bitset(binary, mask);
			adds.forEach(add => {
				mem[parseInt(add, 2)] = parseInt(result[2], 10);
			});
		}
	}

	sum = Object.values(mem).reduce((acc, n) => {
		return acc + n;
	}, 0);

	console.log(sum);
}

processLineByLine();
