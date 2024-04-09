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

	let pointer = 25;
	while (true) {
		let found = false;
		let current = numbers[pointer];
		for (let i = pointer - 25; i < pointer; i++) {
			let check = numbers[i];

			if (check < current && check * 2 !== current) {
				let rest = current - check;
				for (let j = pointer - 25; j < pointer; j++) {
					if (numbers[j] === rest) {
						found = true;
						break;
					}
				}
			}
		}
		if (!found) {
			console.log(numbers[pointer]);
			break;
		} else {
			pointer++;
		}
	}

	let sum = numbers[pointer];
	let range = [];

	let found = numbers.some((n, index) => {
		let s = n;
		let p = index + 1;
		while (true) {
			if (s >= sum) {
				break;
			}
			s += numbers[p]
			p++;
		}
		if (s === sum) {
			range.push(index);
			range.push(p);
			return true;
		}
	});

	if (found) {
		let slice = numbers.slice(range[0], range[1]);
		console.log(Math.max.apply(null, slice) + Math.min.apply(null, slice));
	}

	

}


processLineByLine();
