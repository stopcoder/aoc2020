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
		const parts = line.split(" ");
		n.push({
			r: parts[0].split("-").map(e => parseInt(e, 10)),
			c: parts[1],
			s: parts[2]
		});
	}

	let count = 0;
	n.forEach(e => {
		let repeat = 0;
		if (e.s.charAt(e.r[0] - 1) === e.c) {
			repeat++;
		}
		if (e.s.charAt(e.r[1] - 1) === e.c) {
			repeat++;
		}

		if (repeat === 1) {
			count++;
		}
	});


	console.log(count);



}


processLineByLine();
