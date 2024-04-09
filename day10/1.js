const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const numbers = [];

	for await (const line of rl) {
		numbers.push(parseInt(line, 10));
	}

	numbers.sort((a, b) => a - b);
	console.log(numbers);

	numbers.unshift(0);

	numbers.push(numbers[numbers.length - 1] + 3);

	let n1 = 0;
	let n3 = 0;
	for (let i = 0; i< numbers.length -1;i++) {
		let diff = numbers[i+1] - numbers[i];
		if (diff === 1) {
			n1++;
		} else if (diff === 3) {
			n3++;
		}
	}

	console.log(n1 * n3);

}


processLineByLine();
