const transform = require("./transform.js");
let array = [[1,2,3], [4,5,6], [7,8,9]];
console.log(transform.rotate(array, 4));
console.log(transform.flipH(array));
console.log(transform.flipV(array));



const monster = [
	"                  # ".split(""),
	"#    ##    ##    ###".split(""),
	" #  #  #  #  #  #   ".split("")
];

console.log(transform.rotateWithCopy(monster));
