const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const mapping = {
		"byr": 0,
		"iyr": 1,
		"eyr": 2,
		"hgt": 3,
		"hcl": 4,
		"ecl": 5,
		"pid": 6,
		"cid": -1
	};

	const n = [];
	let data = "";

	for await (const line of rl) {
		if (line !== "") {
			data = data + line + " ";
		} else {
			n.push(data.trim().split(" ").map(e => e.split(":")));
			data = "";
		}
	}

	n.push(data.trim().split(" ").map(e => e.split(":")));

	console.log(n);


	let count = 0;
	n.forEach(passport => {
		const mark = new Array(7).fill(0);

		passport.forEach(e => {
			const index = mapping[e[0]];
			if (index !== -1) {
				mark[index] = 1;
			}
		});

		const sum = mark.reduce((s, e) => {
			return s + e;
		}, 0);

		if (sum === 7) {
			count++;
		}
	});

	console.log(count);
}


processLineByLine();
