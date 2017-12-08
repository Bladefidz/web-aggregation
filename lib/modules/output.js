const fs = require('fs');
const jsonfile = require('jsonfile');
const strMathcer = require('./str-matcher');
const object = require('./object');

/* Global variables */
var type;
var filename;
var formatKeys;
var formatVals;
var hasIter;
var iterKeys;
var buffer;
var bufferWriteSize;

/**
 * Write scraped result into json file
 * @param  {object} data     Scraped result
 * @param  {string} filename Json filename
 */
function writeJson(data, filename) {
	jsonfile.writeFileSync(
        filename,
        data,
        function (err) {
            console.error(err)
        }
    );
    console.log("Saved!");
}

/**
 * Append new data in existed json file
 * @param  {object} data     Scraped result
 * @param  {string} filename Json filename
 */
function appendJson(data, filename) {
	jsonfile.writeFileSync(
        filename,
        data,
        {flag: 'a'},
        function (err) {
            console.error(err)
        }
    );
    console.log("Updated!");
}

/**
 * Write scraped result into csv file
 * @param  {object} data     Scraped result
 * @param  {string} filename Csv filename
 */
function writeCsv(data, filename) {
	let csvData = "";

	for (var i = 0; i < formatKeys.length; i++) {
		csvData += formatKeys[i] + ',';
	}
	csvData += "\r\n";

	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < formatKeys.length; j++) {
			csvData += data[i][formatKeys[j]] + ',';
		}
		csvData += "\r\n";
	}

	fs.writeFileSync(filename, csvData, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});

    console.log("Saved!");
}

/**
 * Parse data from job result data into desired format
 * @param  {object} data Job result data
 */
function parseData(data) {
	let out = {};
	for (let i = 0; i < formatKeys.length; i++) {
		if (formatVals[i][0] == '>') {
			let arrayKeys = formatVals[i].slice(1).split('.');
			out[formatKeys[i]] = object.finds(data, arrayKeys);
        } else {
        	out[formatKeys[i]] = JSON.stringify(data.result);
        }
	}
	return out;
}

/**
 * Push data into buffer after iterate over data
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function pushParseDataIter(data) {
	let iterLen = object.getArrayLength(data, iterKeys);
	bufferWriteSize -= 1;
	bufferWriteSize += iterLen;
	for (let i = 0; i < iterLen; i++) {
		let out = {};
		let indexes = [i];
		for (let j = 0; j < formatKeys.length; j++) {
			if (formatVals[j][0] == '>') {
				let arrayKeys = formatVals[j].slice(1).split('.');
				out[formatKeys[j]] = object.finds(data, arrayKeys, indexes);
	        } else {
	        	out[formatKeys[j]] = JSON.stringify(data.result);
	        }
		}
		buffer.push(out);
	}
}

/**
 * Write buffer into file
 * @param  {array}  data buffer's data
 */
function write(data) {
	if (type == "json") {
		writeJson(data, filename + ".json");
	} else if (type == "csv") {
		writeCsv(data, filename + ".csv");
	} else {
		console.log(data);
	}
}

/* Module export */
module.exports = {
	init:function(output, fn) {
		type = output.type;
		formatKeys = Object.keys(output.format);
		formatVals = Object.values(output.format);
		if (output.hasOwnProperty("iterate")) {
			console.log("has iter");
			hasIter = true;
			iterKeys = output.iterate.slice(1).split('.');
		} else {
			hasIter = false;
		}
		filename = fn;
		buffer = new Array();
		bufferWriteSize = output.buffer_size;
	},
	save:function(data) {
		if (type != "stdout") {
			if (hasIter) {
				pushParseDataIter(data);
			} else {
				buffer.push(parseData(data));
			}
			console.log("Result saved in buffer.");
			console.log("Buffer length=" + buffer.length + " buffer write=" + bufferWriteSize);
			if (buffer.length % bufferWriteSize == 0 ||
				buffer.length > bufferWriteSize) {
				console.log("Writing buffer into " + type + " file...");
				write(buffer);
			}
		} else {
			write(parseData(data));
		}
	},
	writeBuffer:function() {
		write(buffer);
	},
	getBufferSize:function() {
		return buffer.length;
	},
	flush:function() {
		type = "stdout";
		buffer = new Array();
		bufferWriteSize = 0;
		hasIter = false;
		iterKeys = new Array();
		formatKeys = new Array();
		formatVals = new Array();
		filename = null;
	}
}