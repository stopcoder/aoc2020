const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input_loop');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const nodes = {};
	let empty = 0;
	const testing = [];

	for await (const line of rl) {
		if (line === "") {
			empty++;
			continue;
		}

		if (empty === 0) {
			let parts = line.split(": ");
			let children = parts[1].split(" | ").map(e => {
				if (e.indexOf("\"") !== -1) {
					return e.charAt(1);
				} else {
					return e.split(" ").map(el => {
						return parseInt(el, 10);
					});
				}
			});

			nodes[parts[0]] = children;
		} else {
			testing.push(line);
		}

	}

	function traverse(key) {
		let choices = nodes[key];
		let sum = 0;

		choices.forEach(choice => {
			if (typeof choice === "string") {
				sum = 1;
			} else {
				let s = 1;
				choice.forEach(child => {
					s *= traverse(child);
				});
				sum += s;
			}
		});

		return sum;
	}

	// consume the message starting from key and return the rest
	function test(message, key) {
		let choices = nodes[key];
		if (choices.length === 1 && typeof choices[0] === "string") {
			if (message[0] === choices[0]) {
				return [message.substring(1)];
			} else {
				return false;
			}
		}

		let results = [];

		for (let i = 0; i < choices.length; i++) {
			let choice = choices[i];
			let set = [message];

			for (let j = 0; j < choice.length; j++) {
				let result = [];
				set.forEach(m => {
					let r = test(m, choice[j]);
					if (r !== false) {
						result = result.concat(r);
					}
				});

				set = result;
			}

			results = results.concat(set);
		}

		return results;
	}



	let sum = 0;
	testing.forEach((message) => {
		let result = test(message, 0);
		if (result.indexOf("") !== -1) {
			sum++;
		}
	});

	console.log(sum);
}


processLineByLine();
