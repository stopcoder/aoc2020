const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const nodes = {};

	for await (const line of rl) {
		let parsed = line.replace(/ (bags|bag)/g, "").replace(/\.$/g, "");
		let parts = parsed.split(" contain ")
		let node = nodes[parts[0]] = {};
		let children = parts[1].split(", ");
		if (children.length !== 1 || children[0] !== "no other") {
			children.forEach(c => {
				let i = c.indexOf(" ");
				let number = parseInt(c.substring(0, i), 10);
				let name = c.substring(i+1);
				node[name] = number;
			});
		}
	}

	function count(name) {
		let sum = 1;

		let children = nodes[name];
		return Object.keys(children).reduce((n, child) => {
			return n + children[child] * count(child);
		}, sum);
	}

	console.log(count("shiny gold"));
}


processLineByLine();
