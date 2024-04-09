const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const n = [];

	for await (const line of rl) {
		let parsed = line.replace(/[FL]/g, 0).replace(/[BR]/g, 1);
		let row = parseInt(parsed.substring(0, 7), 2);
		let column = parseInt(parsed.substring(7), 2);
		console.log(`row: ${row}, column: ${column}`);
		n[row * 8 + column] = true;
	}

	for (let i = 0; i < n.length; i++) {
		if (i > 0 && i < n.length -1) {
			if (n[i] === undefined && n[i-1] && n[i+1]) {
				console.log(i);
			}
		}
	}

}


processLineByLine();
