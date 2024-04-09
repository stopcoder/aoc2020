const fs = require('fs');
const readline = require('readline');
const t = require('./transform');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const buffer = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});


	const tiles = {};

	let tile;
	let num;

	for await (const line of buffer) {
		if (line === "") {
			if (tile) {
				tiles[num] = tile;
			}
			tile = [];
		} else if (line.indexOf("Tile") !== -1) {
			num = parseInt(line.substring(5, 9), 10);
		} else {
			tile.push(line.split(""));
		}
	}
	tiles[num] = tile;

	console.log(Object.keys(tiles).length);

	// [top, right, bottom, left]
	const borders = {};

	const names = Object.keys(tiles);

	// always from left-right and top-bottom. No reversing is done.
	function getBorder(tile, side) {
		if (side === 0) {
			return tile[0].slice();
		} else if (side === 2) {
			return tile[tile.length - 1].slice();
		} else {
			const column = side === 1 ? tile[0].length - 1 : 0;
			return tile.map(row => row[column]);
		}
	}

	names.forEach(name => {
		tile = tiles[name];
		borders[name] = [getBorder(tile, 0), getBorder(tile, 1), getBorder(tile, 2).reverse(), getBorder(tile, 3).reverse()];
	});

	function arrayEqual(a1, a2) {
		return a1.every((e, i) => e === a2[i]);
	}

	function match(name1, name2) {
		const border1 = borders[name1];
		const border2 = borders[name2];

		for (let i = 0; i < border1.length; i++) {
			for (let j = 0; j < border2.length; j++) {
				if (arrayEqual(border1[i], border2[j])) {
					return [i, j, 1];
				} else if (arrayEqual(border1[i], border2[j].slice().reverse())) {
					return [i, j, 0]
				}
			}
		}
	}

	const nbs = {};

	for (let i = 0; i < names.length - 1; i++) {
		for (let j = 0; j < names.length; j++) {
			if (i === j) {
				continue;
			}

			let matchResult = match(names[i], names[j]);

			if (matchResult) {
				nbs[names[i]] ??= {};
				nbs[names[j]] ??= {};

				nbs[names[i]][names[j]] = matchResult;
				nbs[names[j]][names[i]] = [matchResult[1], matchResult[0], matchResult[2]];
			}
		}
	}

	let group = [[], [], []];
	Object.keys(nbs).forEach(tileName => {
		const ns = Object.keys(nbs[tileName]);
		group[ns.length - 2].push(tileName);
	});

	group[0].forEach((startPoint) => {
		let corners = Object.values(nbs[startPoint]).map(arr => arr[0]).sort();
		console.log(startPoint);
		console.log(corners);
	});

	let startPoint = group[0][0];
	
	const joinBorders = Object.values(nbs[startPoint]).map(arr => arr[0]).sort();
	console.log(joinBorders);

	function adaptIndex(rotation, flipH, flipV) {
		const res = [0, 1, 2, 3];
		let flip = [0, 0, 0, 0];
		let h = (rotation + 1) % 2, v = rotation % 2;

		// rotation
		for (let i = 0; i < rotation; i++) {
			const temp = res.shift();
			res.push(temp);
		}

		if (flipH) {
			const temp = res[h];
			res[h] = res[h+2];
			res[h+2] = temp;
		}

		if (flipV) {
			const temp = res[v];
			res[v] = res[v+2];
			res[v+2] = temp;
		}

		if (flipH || flipV) {
			flip = [1, 1, 1, 1];
		}

		return {
			rotation: res,
			flip: flip
		};
	}

	// left corner should have [1,2]
	let rotation;
	if (joinBorders[0] === 0) {
		if (joinBorders[1] === 3) {
			rotation = 2;
		} else {
			rotation = 1;
		}
	} else if (joinBorders[0] === 1) {
		rotation = 0;
	} else {
		// joinBorders[0] === 2
		rotation = 3;
	}

	// rotate the start point so that it fits the top-left corner
	t.rotate(tiles[startPoint], rotation);

	// calculate the new index
	const newIndex = adaptIndex(rotation).rotation;

	// adapt the connect edge
	Object.values(nbs[startPoint]).forEach((arr) => {
		arr[0] = newIndex[arr[0]];
	});

	const seen = new Set([startPoint]);

	const queue = [[startPoint, 0, 0]];
	const delta = [[-1, 0], [0, 1], [1, 0], [0, -1]];

	const position = [[]];
	position[0][0] = startPoint;

	while (queue.length) {
		const [tileName, r, c] = queue.shift();

		Object.keys(nbs[tileName]).forEach((nextTileName) => {
			if (!seen.has(nextTileName)) {
				seen.add(nextTileName);

				const joint = nbs[tileName][nextTileName];
				const target = (joint[0] + 2) % 4;
				const rotation = (target - joint[1] + 4) % 4;
				const d = delta[joint[0]];
				const nr = r + d[0];
				const nc = c + d[1];

				console.log(`${tileName} at [${r}, ${c}]: positioning ${nextTileName}`);

				position[nr] ??= [];
				position[nr][nc] = nextTileName;

				t.rotate(tiles[nextTileName], rotation);

				let flipH, flipV;
				if (joint[2] === 1) {
					flipH = target % 2 === 0;
					flipV = target % 2 === 1;
				}

				console.log(`before: ${joint}, target side ${target} with rotation ${rotation} flipH ${flipH} flipV ${flipV}`);
				console.log(`position: [${nr}, ${nc}}`)

				if (flipH) {
					t.flipH(tiles[nextTileName]);
				}
				if (flipV) {
					t.flipV(tiles[nextTileName]);
				}

				console.log(`neighbour of ${nextTileName} before:`);
				console.log(nbs[nextTileName]);

				// rotate or flip
				// change the index in its mapping
				const newIndex = adaptIndex(rotation, flipH, flipV);

				Object.values(nbs[nextTileName]).forEach((arr) => {
					arr[0] = newIndex.rotation[arr[0]];
					arr[2] = (arr[2] === newIndex.flip[arr[0]] ? 0 : 1);
				});

				console.log(`neighbour of ${nextTileName} after:`);
				console.log(nbs[nextTileName]);

				console.log();
				console.log();
				queue.push([nextTileName, nr, nc]);
			}
		});
	}

	console.log(position);

	function verify(tileInfo1, tileInfo2) {
		const [tileNumber1, side1] = tileInfo1;
		const [tileNumber2, side2] = tileInfo2;

		return arrayEqual(getBorder(tiles[tileNumber1], side1), getBorder(tiles[tileNumber2], side2));
	}

	console.log("Verify Result:");
	// verify that the borders of the adjacent element are the same
	for (let i = 0; i < position.length; i++) {
		for (let j = 0; j < position[i].length; j++) {
			const tileNumber = position[i][j];
			if (j < position[i].length - 1) {
				const tileRightNumber = position[i][j + 1];
				const valid = verify([tileNumber, 1], [tileRightNumber, 3]);
				if (!valid) {
					console.log([tileNumber, 1], [tileRightNumber, 3]);
				}
			}
			if (i < position.length - 1) {
				const tileDownNumber = position[i + 1][j];
				const valid = verify([tileNumber, 2], [tileDownNumber, 0]);
				if (!valid) {
					console.log([tileNumber, 1], [tileDownNumber, 3]);
				}
			}
		}
	}

	function getChar(r, c) {
		const pr = Math.floor(r / 8);
		const dr = r % 8 + 1;

		const pc = Math.floor(c / 8);
		const dc = c % 8 + 1;

		return tiles[position[pr][pc]][dr][dc];
	}

	function foundMonster(r, c, monster) {
		return monster.every((row, i1) => row.every((char, i2) => {
			if (char === "#") {
				return getChar(r + i1, c + i2) === "#";
			}
			return true;
		}));
	}

	function copy(array) {
		return array.map(row => row.slice());
	}

	let monster = [
		"                  # ".split(""),
		"#    ##    ##    ###".split(""),
		" #  #  #  #  #  #   ".split("")
	];

	[0, 1, 2, 3].some((rotation) => {
		monster = t.rotateWithCopy(monster);
		return [true, false].some(flip => {
			let mCopy = copy(monster);
			if (flip) {
				t.flipH(mCopy);
			}

			const mh = mCopy.length;
			const mw = mCopy[0].length;

			const rl = position.length * (tiles[Object.keys(tiles)[0]].length - 2) - mh;
			const cl = position[0].length * (tiles[Object.keys(tiles)[0]][0].length - 2) - mw;


			const monsterPos = [];
			for (let r = 0; r < rl; r++) {
				for (let c = 0; c < cl; c++) {
					if (foundMonster(r, c, mCopy)) {
						monsterPos.push([r, c]);
					}
				}
			}

			if (monsterPos.length > 0) {
				console.log(monsterPos);
				console.log(rotation, flip);
				mCopy.forEach((row) => console.log(row));

				let count = 0;
				for (let r = 0; r < rl + mh; r++) {
					for (let c = 0; c < cl + mw; c++) {
						if (getChar(r, c) === "#") {
							const containedInMonster = monsterPos.some(([mr, mc]) => {
								if (r >= mr && r < mr + mh && c >= mc && c < mc + mw && mCopy[r - mr][c - mc] === "#") {
									return true;
								}
							});

							if (!containedInMonster) {
								count++;
							}
						}
					}
				}

				console.log(count);
				return true;
			}

		});
	});

}

processLineByLine();
