const fs = require('fs');
const readline = require('readline');
const {
  LinkedList,
  LinkedListNode
} = require('@datastructures-js/linked-list');

async function processLineByLine() {
	// let cups = "476138259".split("");
	let cups = "476138259".split("").map(e => parseInt(e, 10));

	let limit = 10000000;
	let round = 0;

	let map = {};

	const ll = new LinkedList();

	let node;
	cups.forEach(e => {
		node = ll.insertLast(e, node);
		map[e] = node;
	});

	for (let i = 10; i <= 1000000; i++) {
		node = ll.insertLast(i, node);
		map[i] = node;
	}

	// build a circle
	node.setNext(ll.head());

	let curNode = ll.head();
	while (round < limit) {
		if (round % 100000 === 0) {
			console.log(round);
		}
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
				targetValue = 1000000;
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

	node = map[1];
	console.log(node.getNext().getValue() * node.getNext().getNext().getValue());
}

processLineByLine();
