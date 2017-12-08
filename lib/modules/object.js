/**
 * Modify object by array of property recursively
 * @param  {object} obj        Object to modify
 * @param  {array}  properties Array of property
 * @param  {any}    value      Modifier value
 * @param  {int}    d          Counter
 */
function walkModify(obj, properties, value, d) {
	if (d == properties.length - 1) {
		obj[properties[d]] = value;
		// console.log(obj[properties[d]]);
	} else {
		walkModify(obj[properties[d]], properties, value, ++d)
	}
}

/* Module export */
module.exports = {
	modifies: function(obj, properties, value) {
		walkModify(obj, properties, value, 0);
	},
	/**
	 * Find prosper keys stored in properties.
	 * If there are arrays inside object, then you need specifies sequence of
	 * indexes with size equal to array size.
	 * @param  {[type]} obj        [description]
	 * @param  {[type]} properties [description]
	 * @param  {Array}  indexes    [description]
	 * @return {[type]}            [description]
	 */
	finds: function(obj, properties, indexes = []) {
		let ob = obj;
		let ii = 0;
		for (let i = 0; i < properties.length; i++) {
			if (properties[i] == "[]") {
				ob = ob[indexes[ii]];
				ii++;
			} else {
				ob = ob[properties[i]];
			}
		}
		return ob;
	},
	getArrayLength: function(obj, properties) {
		let ob = obj;
		for (let i = 0; i < properties.length; i++) {
			ob = ob[properties[i]];
		}
		return ob.length;
	}
}