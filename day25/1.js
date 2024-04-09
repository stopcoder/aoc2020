const cardKey = 11239946;
const doorKey = 10464955;

const cardLoops = [];
const doorLoops = [];

let num = 1;
let subject = 7;
for (let i = 0; i < 100000000; i++) {
	num = num * subject;
	num = num % 20201227;
	if (num === cardKey) {
		console.log(`card loop size: ${i + 1}`);
		cardLoops.push(i+1);
	}
	if (num === doorKey) {
		console.log(`door loop size: ${i + 1}`);
		doorLoops.push(i+1);
	}
}



const cardEncrps = cardLoops.map(l => {
	let num = 1;
	for (let i = 0; i < l; i++) {
		num = num * doorKey;
		num = num % 20201227;
	}
	
	return num;
});

const doorEncrps = doorLoops.map(l => {
	let num = 1;
	for (let i = 0; i < l; i++) {
		num = num * cardKey;
		num = num % 20201227;
	}
	
	return num;
});

console.log(cardEncrps);
console.log(doorEncrps);
