const fs = require('fs');
const readline = require('readline');
const hash = require('object-hash');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});


	const players = [];
	const gMap = {};

	for await (const line of rl) {
		players.push(line.split(" ").map(e => parseInt(e, 10)));
	}

	function play(players) {
		const map = {};

		let round = 1;

		while (players[0].length !== 0 && players[1].length !== 0) {
			const h = hash(players);
			if (map[h]) {
				// console.log("Repeated! Player1 wins");
				return 0;
			}

			map[hash(players)] = true;

			// console.log(`Round ${round}`);
			// console.log(`Player1: ${players[0]}`);
			// console.log(`Player2: ${players[1]}`);

			const card0 = players[0].shift();
			// console.log(`Player1 plays ${card0}`);
			const card1 = players[1].shift();
			// console.log(`Player2 plays ${card1}`);


			let result;

			if (players[0].length >= card0 && players[1].length >= card1) {
				// console.log("");
				// console.log("---------------");
				// console.log("starting a new game");
				const subPlayer1 = players[0].slice(0, card0);
				const subPlayer2 = players[1].slice(0, card1);
				const subPlayers = [subPlayer1, subPlayer2];
				const subPlayersAlt = [subPlayer2, subPlayer1];
				const subH = hash(subPlayers);
				const subHAlt = hash(subPlayersAlt);
				if (gMap[subH] !== undefined) {
					result = gMap[subH];
				} else if (gMap[subHAlt] !== undefined) {
					result = 1 - gMap[subHAlt];
				} else {
					result = play(subPlayers);
					gMap[subH] = result;
					gMap[subHAlt] = 1 - result;
				}
				// console.log("---------------");
				// console.log("");
			} else {
				result = card0 > card1 ? 0 : 1;
			}

			// console.log(`Player${result+1} wins`);
			// console.log("");

			if (result === 0) {
				players[0].push(card0);
				players[0].push(card1);
			} else {
				players[1].push(card1);
				players[1].push(card0);
			}
			round++;
		}

		if (players[0].length === 0) {
			return 1;
		} else {
			return 0;
		}
	}

	const result = play(players);
	console.log(result);

	const merged = players[0].concat(players[1]);

	const sum = merged.reduce((acc, e, i) => {
		return acc + e * (merged.length - i);
	}, 0);

	console.log(sum);
}

processLineByLine();
