const jsonQuery = require('json-query');

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

/* Module export */
module.exports = {
    select:function(responseBody, selector) {
        responseBody = JSON.parse(responseBody);
        return jsonQuery(selector, {data: responseBody}).value;
    }
};