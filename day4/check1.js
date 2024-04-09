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
// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
	//
	const checks = {
		byr: function(year) {
			let n = parseInt(year, 10);

			return n >= 1920 && n <= 2002;
		},
		iyr: function(year) {
			let n = parseInt(year, 10);

			return n >= 2010 && n <= 2020;
		},
		eyr: function(year) {
			let n = parseInt(year, 10);

			return n >= 2020 && n <= 2030;
		},
		hgt: function(s) {
			const suffix = s.substring(s.length - 2);
			if (suffix === "cm" || suffix === "in") {
				const n = parseInt(s.substring(0, s.length - 2), 10);
				if (suffix === "cm") {
					return n >= 150 && n <= 193;
				} else {
					return n >= 59 && n <= 76;
				}
			}
		},
		hcl: function(s) {
			return /^#[0-9a-f]{6}$/.test(s);
		},
		ecl: function(s) {
			return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].indexOf(s) !== -1;
		},
		pid: function(s) {
			return /^\d{9}$/.test(s);
		}
		
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
			const valid = passport.every(e => {
				if (e[0] === "cid") {
					return true;
				} else {
					return checks[e[0]](e[1]);
				}
			});
			if (valid) {
				count++;
			}
		}
	});

	console.log(count);
}


processLineByLine();
