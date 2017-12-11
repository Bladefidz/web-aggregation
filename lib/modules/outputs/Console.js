class Console {
	constructor () {}

    write(data) {
	    console.log("Output:");
        console.log("#START");
        console.log(data);
        console.log("#END");
    }
}

module.exports = Console;