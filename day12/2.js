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
	let wp = [10, 0, 0, 1];
	let rotateTimes;
	for (let i = 0; i< actions.length; i++) {
		switch (actions[i][0]) {
			case "F":
				values.forEach((v, index) => {
					values[index] += (actions[i][1] * wp[index]);
				});
				break;
			case "R":
				rotateTimes = actions[i][1] / 90;
				for (let j = 0 ; j < rotateTimes ; j++) {
					wp.unshift(wp.pop());
				}
				break;
			case "L":
				rotateTimes = 4 - actions[i][1] / 90;
				for (let j = 0 ; j < rotateTimes ; j++) {
					wp.unshift(wp.pop());
				}
				break;
			case "N":
			case "S":
			case "W":
			case "E":
				wp[directions.indexOf(actions[i][0])] += actions[i][1];
		}
	}

	console.log(Math.abs(values[0] - values[2]) + Math.abs(values[1] - values[3]));
}

processLineByLine();
