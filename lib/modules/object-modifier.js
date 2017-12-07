/**
 * Modify object by array of property recursively
 * @param  {object} obj        Object to modify
 * @param  {array}  properties Array of property
 * @param  {any}    value      Modifier value
 * @param  {int}    d          Counter
 */
function travArrRecv(obj, properties, value, d) {
	if (d == properties.length - 1) {
		obj[properties[d]] = value;
		// console.log(obj[properties[d]]);
	} else {
		travArrRecv(obj[properties[d]], properties, value, ++d)
	}
}

/* Module export */
module.exports = {
	modifyByArray:function(obj, properties, value) {
		travArrRecv(obj, properties, value, 0);
	}
}