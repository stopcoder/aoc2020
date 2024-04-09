const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const lines = [];

	for await (const line of rl) {
		let parts = line.split(" ");
		parts[1] = parseInt(parts[1], 10);

		lines.push(parts);
	}

	const visited = new Array(lines.length).fill(false);

	let pointer = 0;
	let value = 0;
	while (true) {
		if (visited[pointer]) {
			break;
		}
		let code = lines[pointer];
		visited[pointer] = true;
		switch (code[0]) {
			case "acc": 
				value += code[1];
				break;
			case "jmp":
				pointer += (code[1] - 1);
				break;
			case "nop":
				break;
		}
		pointer++;
	}

	console.log(value);
}


processLineByLine();
