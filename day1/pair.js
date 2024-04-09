const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const n = [];

	for await (const line of rl) {
		n.push(parseInt(line, 10));
	}


	for (let i = 0; i < n.length - 2; i++) {
		for (let j = i + 1; j < n.length - 1; j++) {
			for (let k = j + 1; k < n.length ; k++) {
				if (n[i] + n[j] + n[k] === 2020) {
					console.log(`${n[i]}*${n[j]}*${n[k]}=${n[i]*n[j]*n[k]}`);
				}
			}
		}
	}

}


processLineByLine();
