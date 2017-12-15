const fs = require('fs');

class Csv {
	constructor (file, fields) {
        this.file = file;

        let data1 = "";
		for (let i = 0; i < fields.length; i++) {
			data1 += fields[i] + ',';
		}
		data1 += "\r\n";
		fs.writeFileSync(file, data1, function(err) {
		    if(err) {
		        return console.error(err);
		    }
		});
	    console.info("Output: " + file + " created!");
    }

    write(data) {
    	let data1 = "";
		for (let d in data) {
			data1 += data[d] + ',';
		}
		data1 += "\r\n";

		fs.appendFileSync(this.file, data1, (err) => {
			if (err) throw err;
		});

		console.info("Output: " + this.file + " updated!");
    }
}

module.exports = Csv;