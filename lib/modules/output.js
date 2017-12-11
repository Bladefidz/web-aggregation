const strMathcer = require('./str-matcher');
const object = require('./object');
const Csv = require('./outputs/Csv');
const Json = require('./outputs/Json');
const Text = require('./outputs/Text');
const Console = require('./outputs/Console');

class Output {
	constructor(driver, formatKeys, formatVals, iterKeys) {
		this.driver = driver;
		this.formatKeys = formatKeys;
		this.formatVals = formatVals;
		this.iterKeys = iterKeys;
	}

	/**
	 * Parse data from job result data into desired format
	 * @param  {object} data Job result data
	 * @return {Array}       Result
	 */
	writeOne(data) {
		let out = {};
		for (let i = 0; i < this.formatKeys.length; i++) {
			if (this.formatVals[i][0] == '>') {
				let arrayKeys = this.formatVals[i].slice(1).split('.');
				out[this.formatKeys[i]] = object.finds(data, arrayKeys);
	        } else {
	        	out[this.formatKeys[i]] = JSON.stringify(data.result);
	        }
		}
		this.driver.write(out);
	}

	/**
	 * Iterate and parse data from job result data into desired format
	 * @param  {object} data Job result data
	 * @return {Array}       Result
	 */
	writeIter(data) {
		let iterLen = object.getArrayLength(data, this.iterKeys);
		for (let i = 0; i < iterLen; i++) {
			let out = {};
			let indexes = [i];
			for (let j = 0; j < this.formatKeys.length; j++) {
				if (this.formatVals[j][0] == '>') {
					let arrayKeys = this.formatVals[j].slice(1).split('.');
					out[this.formatKeys[j]] = object.finds(
						data, arrayKeys, indexes);
		        } else {
		        	out[this.formatKeys[j]] = JSON.stringify(data.result);
		        }
			}
			this.driver.write(out);
		}
	}

	write(data) {
		if (this.iterKeys.length > 0) {
			this.writeOne(data);
		} else {
			this.writeIter(data);
		}
	}
}

/**
 * Check if given output format has iterable data
 * @param  {[type]} keys     [description]
 * @param  {[type]} vals     [description]
 * @param  {[type]} iterkeys [description]
 * @return {[type]}          [description]
 */
function checkIter(keys, vals, iterkeys) {
	let nope = false;
	for (let i = 0; i < keys.length; i++) {
		if (vals[i][0] == ">") {
			let v = vals[i].slice(1).split('.');
			for (let j = 0; j < v.length; j++) {
				if (v[j] == "[]") {
					nope = true;
					for (k = j; k > 0; k--) {
						iterkeys.push(v[k]);
					}
					break;
				}
			}
		}
		if (nope) break;
	}
}

/* Module export */
module.exports = {
	get:function(output, fn) {
		formatKeys = Object.keys(output.format);
		formatVals = Object.values(output.format);

		var iterKeys = [];
		checkIter(formatKeys, formatVals, iterKeys);

		let driver;
		if (output.type == "csv") {
			driver = new Csv(fn + ".csv", formatKeys);
		} else if (output.type == "json") {
			driver = new Json(fn + ".json");
		} else if (output.type == "text") {
			driver = new Text(fn + ".txt");
		} else {
			driver = new Console();
		}

		return new Output(driver, formatKeys, formatVals, iterKeys);
	}
}