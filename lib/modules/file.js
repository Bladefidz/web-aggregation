const fs = require('fs');
const jsonfile = require('jsonfile');

/**
 * Write scraped result into json file
 * @param  {object} data     Scraped result
 * @param  {string} filename Json filename
 */
function writeJson(data, filename) {
	jsonfile.writeFileSync(
        filename,
        data,
        {flag: 'a'},
        function (err) {
            console.error(err)
        }
    );
}

/**
 * Write scraped result into csv file
 * @param  {object} data     Scraped result
 * @param  {string} filename Csv filename
 */
function writeCsv(data, filename) {
	let csv = "";
	let header = Object.keys(data);

	for (var i = 0; i < header.length; i++) {
		csv += header[i] + ',';
	}
	csv += "\r\n";

	let max = 0;
	for (var i = 0; i < header.length; i++) {
		if (data[i].length > max) {
			max = data[i].length;
		}
	}

	for (var i = 0; i < max; i++) {
		for (var i = 0; i < header.length; i++) {
			csv += data[header[i]] + ',';
		}
		csv += "\r\n";
	}

	fs.writeFileSync(filename, csv, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

/**
 * Write scraped result into custom format of csv file
 * @param  {object} data     Scraped result
 * @param  {string} filename Csv filename
 * @param  {object} format   Csv format
 */
function writeCustomCsv(data, filename, format) {
	let csv = "";

	if (typeof format == "object") {
		let header = Object.keys(data);
		for (var i = 0; i < header.length; i++) {
			csv += header[i] + ',';
		}
		csv += "\r\n";
	}

	fs.writeFileSync(filename, csv, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

/* Module export */
module.exports = {
	write:function(data, type, filename, format = null) {
		if (type == "json") {
			writeJson(data, filename + ".json");
		} else if (type == "csv") {
			if (format != null) {
				writeCustomCsv(data, filename + ".csv", format);
			} else {
				writeCsv(data, filename + ".csv");
			}
		}
	}
}