const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input1');

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

	const pairs = [];

	for await (const line of rl) {
		let parts = line.split(",");

		parts.forEach((p, i) => {
			if (p !== "x") {
				let id = parseInt(p, 10);
				if (i >= id) {
					i = i % id;
				}
				pairs.push([id, i===0? 0: id - i]);
			}
		});
		break;
	}


	console.log(pairs);

	let start = 114;

	while (true) {
		const valid = pairs.every(p => {
			return (start % p[0]) === p[1];
		});

		if (valid) {
			console.log(start);
			break;
		} else {
			console.log(start + " doesn't match");
		}

		start += 59;
	}
}


processLineByLine();
