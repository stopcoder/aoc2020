function processLineByLine() {

	const numbers = [0,12,6,13,20,1,17];
	// const numbers = [1,2,3];
	const limit = 30000000;
	const start = new Date();


	const mem = {};

	for (let i = 0; i < numbers.length - 1; i++) {
		mem[numbers[i]] = i;
	}

	let pointer = numbers.length;
	let last = numbers[numbers.length - 1];
	while (pointer < limit) {
		const p_index = mem[last];
		let value;
		if (p_index !== undefined) {
			value = pointer - 1 - p_index;
		} else {
			value = 0;
		}
		mem[last] = pointer - 1;
		last = value;
		pointer++;
		if (pointer % 1000000 === 0) {
			console.log(pointer);
		}
	}

	console.log("answer: " + last);
	console.log(((new Date()).getTime() - start.getTime()) / 1000 / 60);
}


processLineByLine();
