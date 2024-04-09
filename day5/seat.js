const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let max = 0;

	for await (const line of rl) {
		let parsed = line.replace(/[FL]/g, 0).replace(/[BR]/g, 1);
		let row = parseInt(parsed.substring(0, 7), 2);
		let column = parseInt(parsed.substring(7), 2);
		console.log(`row: ${row}, column: ${column}`);
		max = Math.max(max, row * 8 + column);
	}

	console.log(max);

}


processLineByLine();
