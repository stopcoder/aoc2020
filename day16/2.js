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
	let myTicket;
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
			} else if (emptyLines === 1) {
				myTicket = line.split(",").map(e => parseInt(e, 10));
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
	let fieldData = new Array(otherTickets[0].length);

	for (let i = 0; i < fieldData.length; i++) {
		fieldData[i] = [];
	}

	for (let i = 0; i< otherTickets.length; i++) {
		let ticket = otherTickets[i];
		let invalid = ticket.some(e => {
			return !mark[e];
		});

		if (invalid) {
			continue;
		}
		ticket.forEach((e, j) => {
			fieldData[j].push(e);
		});
	}

	const invalidMap = {};
	let result = [];

	function arrange(arr) {
		console.log(`${arr} ready`);
		const key = arr.map(e => e).sort((a, b) => a - b).join(",");

		if (invalidMap[key]) {
			return;
		}

		if (arr.length === fieldData.length) {
			result.push(arr);
			return true;
		}
		let found = false;

		for (let i = 0; i < ranges.length; i++) {
			if (arr.indexOf(i) === -1) {
				const r = ranges[i];
				let valid = fieldData[arr.length].every(e => {
					return (e >= r[0] && e <= r[1]) || (e >= r[2] && e <= r[3]);
				});
				if (valid) {
					// console.log(`range ${i} fit field ${arr.length}`);
					let copy = arr.map(e => e);
					copy.push(i);
					let result = arrange(copy);
					if (result) {
						found = true;
						// return result;
					}
				}
			}
		}

		if (!found) {
			invalidMap[key] = true;
		}
	}

	arrange([]);
	console.log(result);

	result = result[0];

	result = result.reduce((acc, r, i) => {
		if (r < 6) {
			return acc * myTicket[i];
		} else {
			return acc;
		}
	}, 1);

	console.log(result);
}


processLineByLine();
