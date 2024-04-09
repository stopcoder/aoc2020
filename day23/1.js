const {
  LinkedList,
  LinkedListNode
} = require('@datastructures-js/linked-list');

async function processLineByLine() {


	// let cups = "476138259".split("");
	let cups = "476138259".split("").map(e => parseInt(e, 10));

	const ll = new LinkedList();
	let map = {};

	let node;
	cups.forEach(e => {
		node = ll.insertLast(e);
		map[e] = node;
	});
	// build a circle
	node.setNext(ll.head());

	let curNode = ll.head();
	let limit = 100;
	let round = 0;

	while (round < limit) {
		let pickedStart = curNode.getNext();
		let pickedEnd = curNode;
		let pickedValues = [];
		for (let i = 0; i < 3; i++) {
			pickedValues.push(pickedEnd.getNext().getValue());
			pickedEnd = pickedEnd.getNext();
		}

		let targetValue = curNode.getValue();
		let found = false;
		while (!found) {
			targetValue--;
			if (targetValue === 0) {
				targetValue = 9;
			}
			found = pickedValues.indexOf(targetValue) === -1;
		}

		const target = map[targetValue];
		curNode.setNext(pickedEnd.getNext());
		pickedEnd.setNext(target.getNext());
		target.setNext(pickedStart);

		curNode = curNode.getNext();

		round++;
	}

	node = map[1].getNext();
	let res = "";
	while (node.getValue() !== 1) {
		res += node.getValue();
		node = node.getNext();
	}

	console.log(res);

}


processLineByLine();
