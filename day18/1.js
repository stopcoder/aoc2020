const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const exps = [];

	for await (const line of rl) {
		exps.push(line);
	}

	function evaluate(exp) {
		const stack = [];
		for (let i = 0; i < exp.length; i++) {
			let c = exp[i];
			let n;
			if (c >= "0" && c <= "9") {
				n = parseInt(c, 10);
			} else if (c === "+" || c === "*" || c === "(") {
				stack.push(c);
			} else if (c === ")") {
				n = stack.pop();
				stack.pop();
			}
			if (n !== undefined) {
				let last = stack[stack.length - 1];
				if (last === "+" || last === "*") {
					stack.pop();
					let left = stack.pop();
					if (last === "+") {
						n = left + n;
					} else {
						n = left * n;
					}
				}
				stack.push(n);
			}
		}
		return stack[0];
	}

	let sum = 0;

	for (let i = 0; i< exps.length; i++) {
		let value = evaluate(exps[i]);
		sum += value;
		console.log(`${exps[i]} = ${value}`);
	}

	console.log(sum);
}


processLineByLine();
