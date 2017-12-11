const fs = require('fs');
const jsonfile = require('jsonfile');

class Json {
	constructor (file) {
        this.file = file;
    }

    write(data) {
    	let f = {};
    	if (fs.existsSync(path)) {
    		f.flag = 'a';
	    }
    	jsonfile.writeFileSync(this.file, data, f, function (err) {
	        console.error(err)
	    });

	    console.info("Output: " + this.file + "updated!");
    }
}

module.exports = Json;