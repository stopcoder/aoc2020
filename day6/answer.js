const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let sum = 0;
	let map = {};
	let count = 0;

	for await (const line of rl) {
		if (line !== "") {
			line.split("").forEach(c => {
				map[c] = map[c] || 0;
				map[c]++;
			});
			count++;
		} else {
			Object.keys(map).forEach(c => {
				if (map[c] === count) {
					sum++;
				}
			});
			map = {};
			count = 0;
		}
	}

	Object.keys(map).forEach(c => {
		if (map[c] === count) {
			sum++;
		}
	});

	console.log(sum);

}


processLineByLine();
