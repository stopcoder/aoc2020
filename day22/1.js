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

	const players = [];

	for await (const line of rl) {
		players.push(line.split(" ").map(e => parseInt(e, 10)));
	}

	let round = 1;

	while (players[0].length !== 0 && players[1].length !== 0) {
		const card0 = players[0].shift();
		const card1 = players[1].shift();

		if (card0 > card1) {
			players[0].push(card0);
			players[0].push(card1);
		} else {
			players[1].push(card1);
			players[1].push(card0);
		}

		console.log(`round ${round}:`)
		console.log(players[0]);
		console.log(players[1]);
		console.log("");

		round++;
	}

	const merged = players[0].concat(players[1]);

	const sum = merged.reduce((acc, e, i) => {
		return acc + e * (merged.length - i);
	}, 0);

	console.log(sum);

}


processLineByLine();
