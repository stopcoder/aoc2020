function rotate(array, clockwiseCount) {
	const rc = array.length;
	const cc = array[0].length;

	const rowLimit = Math.ceil(rc / 2);

	for (let r = 0; r < rowLimit; r++) {
		for (let c = r; c < cc - 1 - r; c++) {
			const mapping = [[r, c], [c, rc - 1 - r], [rc - 1 - r, cc - 1 - c], [cc - 1 - c, r]];

			const cache = [];

			mapping.forEach((coord, index) => {
				const target = (index + clockwiseCount) % 4;
				const targetCoord = mapping[target];
				const value = cache[index] === undefined ? array[coord[0]][coord[1]] : cache[index];

				const temp = array[targetCoord[0]][targetCoord[1]];
				cache[target] = temp;

				array[targetCoord[0]][targetCoord[1]] = value;
			});

		}
	}

	return array;
}

function rotateWithCopy(array) {
	const res = [];
	for (let c = 0; c < array[0].length; c++) {
		const newRow = [];
		for (let r = array.length - 1; r >= 0; r--) {
			newRow.push(array[r][c]);
		}
		res.push(newRow);
	}

	return res;
}

function flipH(array) {
	for (let r = 0; r < array.length; r++) {
		const columnLimit = Math.floor(array[r].length / 2);
		for (let c = 0;  c < columnLimit; c++) {
			const temp = array[r][c];
			array[r][c] = array[r][array[r].length - 1 - c];
			array[r][array[r].length - 1 - c] = temp;
		}
	}
	return array;
}

function flipV(array) {
	const rowLimit = Math.floor(array.length / 2);
	for (let r = 0; r < rowLimit; r++) {
		for (let c = 0;  c < array[0].length; c++) {
			const temp = array[r][c];
			array[r][c] = array[array.length - 1 - r][c];
			array[array.length - 1 - r][c] = temp;
		}
	}

	return array;
}


module.exports = {rotate, rotateWithCopy, flipH, flipV};

