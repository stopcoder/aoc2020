let a = 1005595;
let b = [41,37,557,29,13,17,23,419,19];
let c = b.map(v => {return v - a % v});

let result = c.reduce((acc, e, i) => {
	if (e < acc[0]) {
		return [e, i];
	}

	return acc;
}, [1000, -1]);

console.log(result[0]*b[result[1]]);



