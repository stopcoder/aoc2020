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
		const parts = line.split("");
		n.push(parts);
	}

	let count = 0;
	let column = 0;
	n.forEach(e => {
		let index = column % e.length;
		if (e[index] === "#") {
			count++;
		}
		column += 3;
	});


	console.log(count);



}


processLineByLine();
