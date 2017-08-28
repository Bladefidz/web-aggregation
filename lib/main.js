/* Modules declarations */
const request = require('request');
const path = require('path');
const config = require('./modules/config');
const selector = require('./modules/selector');

module.exports = {
    scrape:function(jobConf, callback) {
        let requestConf = config.parseRequest(jobConf);

        request(
            requestConf,
            function (error, response, body) {
                if (jobConf.hasOwnProperty('selector')) {
                    body = selector.run(
                        response,
                        body,
                        jobConf.selector
                    );
                }

                callback(error, response, body);
            }
        );
    },

    scrapes:function(jobConfs, enumerators, callback) {

    }
};