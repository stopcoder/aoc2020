const S = [14,8,16,0,1,17];

const last_index = {};

const start = new Date();

for (let i = 0; i < S.length - 1; i++) {
	last_index[S[i]] = i;
}

while (S.length < 30000000) {
	let prev = S[S.length - 1];
	let prev_prev = last_index[prev];
	last_index[prev] = S.length - 1;
	let next_;
	if (prev_prev === undefined) {
		next_ = 0;
	} else {
		next_ = S.length - 1 - prev_prev;
	}
	S.push(next_);
	if (S.length === 2020) {
		console.log(next_);
	}
}
const end = new Date();
console.log(S[S.length - 1]);
console.log((end.getTime() - start.getTime()) / 1000 / 60);

