/**
 * JSON Filter Distinct
 * Filter parsed JSON data by remove duplicated data depend on given parameter.
 *
 * # Parameter
 * Simple duplicate removing is depend on value by specific key.
 * For example:
 *     Parameter = "data.id"
 *         Will be remove any row data if appeared after specific id
 *
 * @param  {object} data      JSON array data
 * @param  {string} pivotKey  Distinct pivotKey
 * @return {object}           Non duplicated JSON data
 */
function distinct(data, pivotKey) {
    // First, rank the data
    sort(data, pivotKey);

    // Selection to remove duplicate key
    let result = [];
    let currentPivot;
    let i = 0;

    currentPivot = data[0][pivotKey];
    result.push(data[i]);
    i++;

    for (; i < data.length; i++) {
        if (data[i][pivotKey] != currentPivot) {
            currentPivot = data[i][pivotKey];
            result.push(data[i]);
        }
    }

    return result;
}

/**
 * Implementing merge sort to rank JSON key-value pair
 * by attributed defined in parameter
 * @param  {object}  data      JSON array data
 * @param  {string}  pivotKey  Key which used as pivot to do sorting
 * @param  {boolean} Ascending Ascending order
 * @return {void}
 */
function sort(data, pivotKey, ascending = true) {
    // Use merge sort
    // https://dxr.mozilla.org/seamonkey/source/js/src/jsarray.c

    if (ascending == true) {
        data.sort(function(cur, next){
            cur[pivotKey] - next[pivotKey]
        });
    } else {
        data.sort(function(cur, next){
            next[pivotKey] - cur[pivotKey]
        });
    }
}

function ssplit(data, by) {
    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i].split(by);
        }
        return data;
    }
    return data.split(by);
}

function trim(data) {
    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i].trim();
        }
        return data;
    }
    return data.trim();
}

function trimleft(data) {
    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i].trimleft();
        }
        return data;
    }
    return data.trimleft();
}

function trimright(data) {
    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i].trimright();
        }
        return data;
    }
    return data.trimright();
}

module.exports = {
	run: function(data, proc) {
		for (let i = 0; i < proc.length; i++) {
			let p = proc[i].split(" ");
			if (p[0] == "distinct") {
		        data = distinct(data, p[1]);
		    } else if (p[0] == "sort") {
		        sort(data, proc[1]);
		    } else if (p[0] == "split") {
		    	data = ssplit(data, proc[1]);
            } else if (p[0] == "trim") {
                data = trim(data);
            } else if (p[0] == "trimleft") {
                data = trimleft(data);
            } else if (p[0] == "trimright") {
                data = trimright(data);
		    } else if (p[0] == "exec") {
		    	let exe = require('../../input/scripts/' + p[1]);
		    	data = exe.run(data);
		    }
		}
		return data;
	}
}