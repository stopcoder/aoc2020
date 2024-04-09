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


	let vs = [
		[1, 1],
		[3, 1],
		[5, 1],
		[7, 1],
		[1, 2]
	];
	let result = 1;
	vs.forEach((v) => {
		let count = 0;
		let column = 0;

		for (let i = 0; i < n.length; i = i+v[1]) {
			let index = column % n[i].length;
			if (n[i][index] === "#") {
				count++;
			}
			column += v[0];
		}

		result *= count;
	})

	console.log(result);



}


processLineByLine();
