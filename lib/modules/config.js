const fs = require('fs');
const path = require('path');
const winston = require('winston');
const command = require('./command');

/* FUnction declarations */
/**
 * Load request configuration
 * @return {object} Request configuration
 */
function loadRequestConfiguration() {
    return JSON.parse(fs.readFileSync(
        path.join(__dirname, '..', 'config', 'request.json'),
        'utf8')
    );
}

/**
 * Parse query string
 * @param  {object} qs       Query string
 * @return {object}          JSON object
 */
function parseQueryString(qs) {
    for (let key in qs) {
        if (qs[key][0] == '>') {
            qs[key] = command.parse(qs[key]);
        }
    }

    return qs;
}

/**
 * Load Log Configuration
 * @return {object} Log object
 */
function loadLogConfiguration() {
    return JSON.parse(fs.readFileSync(
        path.join(__dirname, '..', 'config', 'log.json'),
        'utf8')
    );
}

/**
 * Load crawler job configuration
 * @return {object} Crawler configuration
 */
function loadCrawlerConfig() {
    return JSON.parse(fs.readFileSync(
        path.join(__dirname, '..', 'config', 'crawler.json'),
        'utf8')
    );
}

/* Module export */
module.exports = {
    /**
     * Initialize request configuration
     * @param  {object} method Job configuration
     * @return {object}        [description]
     */
    parseRequest:function(jobConf) {
        requestConf = loadRequestConfiguration();

        if (!jobConf.hasOwnProperty('url')) {
            return {};
        }

        for (let key in jobConf) {
            if (key != "selector"
                && key != "id"
                && key != "name"
                && (!requestConf.hasOwnProperty(key))) {
                requestConf[key] = jobConf[key];
            } else {
                if (key == "headers") {
                    for (let key1 in jobConf.headers) {
                        requestConf.headers[key1] = jobConf.headers[key1];
                    }
                }
            }
        }

        if (jobConf.hasOwnProperty('qs')) {
            jobConf.qs = parseQueryString(jobConf.qs);
        }

        return requestConf;
    },

    /**
     * Initialize process log instance
     * @return {instance} Instance of log module
     */
    initLogger: function() {
        let logConf = loadLogConfiguration();
        let tsFormat = function () {
            (new Date()).toLocaleTimeString()
        }
        let console = {
            timestamp: tsFormat,
            colorize: true
        }
        let file = {
            colorize: true,
            timestamp: tsFormat
        }

        if (logConf.file == "default") {
            file.filename = path.join(__dirname, '..', 'log', 'crawler.log');
        } else {
            file.filename = path.join(__dirname, '..', '..', logConf.file);
        }

        if (logConf.level.toLowerCase() != "notset") {
            console.level = logConf.level.toLowerCase();
            file.level = logConf.level.toLowerCase();
        }

        return new (winston.Logger)(
            {
                transports: [
                    new (winston.transports.Console)(console),
                    new (winston.transports.File)(file)
                ]
            });
    },
}