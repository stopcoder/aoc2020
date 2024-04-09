const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let allergies = {};
	const foods = [];

	function common(arr1, arr2) {
		return arr1.filter(e => {
			return arr2.indexOf(e) !== -1;
		});
	}

	for await (const line of rl) {
		const trimmed = line.substring(0, line.length - 1);
		const parts = trimmed.split(" (contains ");

		const food = {
			i: parts[0].split(" "),
			a: parts[1].split(", ")
		};

		food.a.forEach(e => {
			if (allergies[e]) {
				allergies[e] = common(allergies[e], food.i);
			} else {
				allergies[e] = food.i;
			}
		});

		foods.push(food);
	}

	const allergieIngs = {};

	Object.keys(allergies).forEach(name => {
		allergies[name].forEach(ing => {
			allergieIngs[ing] = true;
		});
	});
	
	let count = 0;

	foods.forEach(f => {
		f.i.forEach(ing => {
			if (!allergieIngs[ing]) {
				count++;
			}
		});
	});

	console.log(count);

	let result = {};

	while (Object.keys(allergies).length > 0) {
		Object.keys(allergies).forEach(name => {
			if (allergies[name].length === 1) {
				result[allergies[name][0]] = name;
				delete allergies[name];
			}
		});

		Object.keys(allergies).forEach(name => {
			for (let i = allergies[name].length - 1; i >= 0 ; i--) {
				if (result[allergies[name][i]]) {
					allergies[name].splice(i, 1);
				}
			}
		});
	}

	console.log(result);

	const sortedKeys = Object.keys(result).sort(function(ing1, ing2) {
		return result[ing1].localeCompare(result[ing2]);
	});

	console.log(sortedKeys.join(","));

}


processLineByLine();
