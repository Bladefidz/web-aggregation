const fs = require('fs');
const path = require('path');
const winston = require('winston');

/* Global variable declarations */
var reqConf = null;
var jobConf = null;
var logConf = null;

/* Function declarations */
/**
 * Load request configuration
 * @return {object} Request configuration
 */
function getReqConf() {
    if (reqConf == null) {
        reqConf = JSON.parse(fs.readFileSync(
            path.join(__dirname, '..', 'config', 'request.json'),
            'utf8')
        );
    }
    return reqConf;
}

/**
 * Load Log Configuration
 * @return {object} Log object
 */
function getLogConfiguration() {
    if (jobConf == null) {
        jobConf = JSON.parse(fs.readFileSync(
            path.join(__dirname, '..', 'config', 'log.json'),
            'utf8')
        );
    }
    return jobConf;
}

/**
 * Load job configuration
 * @return {object} Job configuration
 */
function getJobConf() {
    if (jobConf == null) {
        jobConf = JSON.parse(fs.readFileSync(
            path.join(__dirname, '..', 'config', 'job.json'),
            'utf8')
        );
    }
    return jobConf;
}

/* Module export */
module.exports = {
    getRequestConfiguration: function () {
        return getReqConf();
    },
    getJobConfig: function() {
        return getJobConf();
    },
    /**
     * Initialize process log instance
     * @return {instance} Instance of log module
     */
    initLogger: function() {
        let logConf = getLogConfiguration();
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