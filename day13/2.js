const fs = require('fs');
const readline = require('readline');
const BigNumber = require('bignumber.js');

async function processLineByLine() {
	function modInverse(n, m) {
		let res = 1;
		while (!n.times(res).mod(m).eq(1)) {
			res++;
		}
		return res;
	}
	function chineseRemainder(a, n){
		var m;
		var i = 1;
		var prod = BigNumber(1);
		var sm = BigNumber(0);
		for(i=0; i< n.length; i++){
			prod = prod.times(n[i]) ;
		}
		for(i=0; i< n.length; i++){
			m = prod.div(n[i]);
			sm = sm.plus(m.times(modInverse(m, n[i])).times(a[i]));
		}
		return sm.mod(prod);
	}


	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const pairs = [];

	for await (const line of rl) {
		let parts = line.split(",");

		parts.forEach((p, i) => {
			if (p !== "x") {
				let id = parseInt(p, 10);
				let remainder = id - i;
				while (remainder < 0) {
					remainder += id;
				}
				pairs.push([id, remainder % id]);
			}
		});
		break;
	}


	console.log(pairs);
	const remainders = [];
	const dividors = [];
	for (let i = 0; i < pairs.length; i++) {
		dividors.push(pairs[i][0]);
		remainders.push(pairs[i][1]);
	}

	var answer = chineseRemainder(remainders, dividors);
	console.log(answer.toString());
}


processLineByLine();
