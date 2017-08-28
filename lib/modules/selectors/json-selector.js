const jsonQuery = require('json-query');
const sortJsonArray = require('sort-json-array');

/* Function declarations */
/**
 * JSON Find by Key
 * @param  {object} data Parsed JSON data
 * @param  {string} key  Key to find
 * @return {mixed}       Filtered data
 */
function jsonFindbyKey(data, key) {
    if (data.hasOwnProperty(key)) {
        data = data[key];
    }

    return data;
}

/**
 * JSON Find by Key in Array
 * @param  {object}   data   Current data
 * @param  {string}   key    Key to find
 * @return {array}           Found data
 */
function jsonFindbyKeyinArray(data, key) {
    result = [];

    for (let i = 0; i < data.length; i++) {
        result.push(jsonFindbyKey(data[i], key));
    }

    return result;
}

/**
 * [jsonFindbyKeysinArray description]
 * @param  {object} data [description]
 * @param  {array}  keys [description]
 * @param  {Number} i    [description]
 * @return {[type]}      [description]
 */
function jsonFindbyKeysinArray(data, keys, i = 0) {
    if (i < keys.length && data.hasOwnProperty(keys[i])) {
        i++;
        data = data[keys[i]];
        jsonFindbyKeysinArray(data, keys, i);
    }
}

/**
 * JSON Find by Keys
 * Find specific value in JSON by given key string in array
 *
 * @param  {json}     data      Parsed JSON
 * @param  {array}    keys      Array of key string
 * @param  {integer}  depth     How much depth to walk in json using key,
 *                              this is advantage to use if the key likely not found
 * @return {mixed}              Value in specific key
 */
function jsonFindbyKeys(data, keys, depth = 0) {
    if (depth = 0) {
        depth = keys.length;
    }

    let currentKey;

    for (let i = 0; i < depth; i++) {
        currentKey = keys.split('[');

        if (currentKey.length > 1) {
            // So this is array data type and used integer as key

            currentKeys = keys[i].substring(1, keys[i].length - 1).split('.');

            if (currentKey.length > 1) {
                data = jsonFindbyKeysinArray(data, currentKeys);
            } else {
                data = jsonFindbyKeyinArray(data, currentKeys[0]);
            }
        } else {
            data = jsonFindbyKey(data, keys[i]);
        }
    }

    return data;
}

/**
 * JSON post processor
 * Processing json object data by given command.
 *
 * # Command
 * Format: <command> <parameter>
 *
 * @param  {object} data    Parsed JSON
 * @param  {string} command Command query
 * @return {object}         Result
 */
function jsonPostProcessor(data, command) {
    if (command.substring(0, 8) == "distinct") {
        data = jsonFilterDistict(
            data,
            command.substring(9, command.length)
        );
    } else if (command.substring(0, 4) == "sort") {
        jsonSort(data, command.substring(5, command.length));
    }

    return data;
}

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
function jsonFilterDistict(data, pivotKey) {
    // First, rank the data
    jsonSort(data, pivotKey);

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
 * JSON Rank
 * Implementing merge sort to rank JSON key-value pair
 * by attributed defined in parameter
 * @param  {object}  data      JSON array data
 * @param  {string}  pivotKey  Key which used as pivot to do sorting
 * @param  {boolean} Ascending Ascending order
 * @return {void}
 */
function jsonSort(data, pivotKey, ascending = true) {
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

/* Module export */
module.exports = {
    select:function(responseBody, selector) {
        let query = [];
        let data;
        let len;

        responseBody = JSON.parse(responseBody);
        query = selector.split('|');
        len = query.length;

        if (selector[0] != '|') {
            selector = jsonQuery(
                query[0],
                {data: responseBody}
            ).value;
        } else {
            len += 1;
        }

        if ((typeof selector != "undefined") && query.length > 1) {
            for (let i = 1; i < query.length; i++) {
                selector = jsonPostProcessor(selector, query[i]);
            }
        }

        return selector;
    }
};