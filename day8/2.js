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

	function try1(codes) {
		const visited = new Array(codes.length).fill(false);

		let pointer = 0;
		let value = 0;
		while (true) {
			if (visited[pointer]) {
				return false;
			}

			if (pointer === codes.length - 1) {
				return value;
			}
			let code = codes[pointer];
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
	}

	let final;
	lines.some((line, i) => {
		if (line[0] === "jmp" || line[0] === "nop") {
			let copy = lines.map(e => {
				return e.map(f => f);
			});

			copy[i][0] = (line[0] === "jmp" ? "nop" : "jmp");

			let result = try1(copy);
			if (result !== false) {
				final = result;
				return true;
			}
		}
	});

	console.log(final);
}


processLineByLine();
