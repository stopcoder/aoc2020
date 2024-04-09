const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

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

	let mem = {};

	function compose(key) {
		let choices = nodes[key];
		if (choices.length === 1 && typeof choices[0] === "string") {
			return choices[0];
		}

		if (mem[key]) {
			return mem[key];
		}

		let result = choices.reduce((acc, choice) => {
			let elements = choice.map(child => {
				return compose(child);
			});

			if (elements.length === 1) {
				acc = acc.concat(elements[0]);
			} else {
				for (let i = 0; i < elements[0].length; i++) {
					for (let j = 0; j < elements[1].length; j++) {
						acc.push(elements[0][i] + elements[1][j]);
					}
				}
			}
			return acc;
		}, []);

		mem[key] = result;
		return result;
	}

	const messages = compose(0);

	const count = testing.reduce((acc, message) => {
		if (messages.indexOf(message) !== -1) {
			acc++;
		}
		return acc;
	}, 0);

	console.log(count);

}


processLineByLine();
