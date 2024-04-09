const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const up = {};

	for await (const line of rl) {
		let parsed = line.replace(/ (bags|bag)/g, "").replace(/\.$/g, "");
		let parts = parsed.split(" contain ")
		let children = parts[1].replace(/\d+ /g, "").split(", ");
		if (children.length !== 1 || children[0] !== "no other") {
			children.forEach(c => {
				up[c] = up[c] || {};
				up[c][parts[0]] = 1;
			});
		}
	}

	const visited = {
	};

	const queue = ["shiny gold"];

	while(queue.length > 0) {
		let e = queue.pop();
		if (up[e]) {
			Object.keys(up[e]).forEach(c => {
				if (!visited[c]) {
					queue.push(c);
				}
			});
		}
		visited[e] = true;
	}

	console.log(Object.keys(visited).length - 1);

}


processLineByLine();
