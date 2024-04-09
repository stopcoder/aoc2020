const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let emptyLines = 0;
	const ranges = [];
	const otherTickets = [];

	for await (const line of rl) {
		if (line === "") {
			emptyLines++;
		} else {
			if (emptyLines === 0) {
				let parts = line.split(" or ");
				ranges.push(parts.reduce((acc, part) => {
					part.split("-").forEach(e => acc.push(parseInt(e, 10)));
					return acc;
				}, []));
			} else if (emptyLines === 2) {
				otherTickets.push(line.split(",").map(e => parseInt(e, 10)));
			}
		}
	}

	const mark = new Array(1000).fill(false);
	ranges.forEach((r) => {
		mark.fill(true, r[0], r[1] + 1);
		mark.fill(true, r[2], r[3] + 1);
	});

	console.log(mark);
	let neg = mark.reduce((acc, e) => {
		return acc + (e ? 0 : 1)
	}, 0);
	console.log(neg);

	let sum = 0;

	for (let i = 0; i< otherTickets.length; i++) {
		let ticket = otherTickets[i];
		ticket.forEach(e => {
			if(!mark[e]) {
				sum += e;
			}
		});
	}

	console.log(sum);
}


processLineByLine();
