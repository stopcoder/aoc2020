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

	const directions = ["E", "S", "W", "N"];

	const actions = [];

	for await (const line of rl) {
		let action = line.charAt(0);
		let value = line.substring(1);
		actions.push([action, parseInt(value, 10)]);
	}

	let current = 0;
	let values = [0, 0, 0, 0];

	for (let i = 0; i< actions.length; i++) {
		switch (actions[i][0]) {
			case "F":
				values[current] += actions[i][1];
				break;
			case "R":
				current = (current + actions[i][1] / 90) % 4;
				break;
			case "L":
				current = (current + (4 - actions[i][1] / 90)) % 4;
				break;
			case "N":
			case "S":
			case "W":
			case "E":
				values[directions.indexOf(actions[i][0])] += actions[i][1];
		}
	}

	console.log(Math.abs(values[0] - values[2]) + Math.abs(values[1] - values[3]));
}

processLineByLine();
