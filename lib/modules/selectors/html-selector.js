const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');

module.exports = {
    select: function(body, selector) {
        let $ = cheerio.load(body);
        jsonframe($);

        if (selector.substring(0, 5) == 'head.') {
            return $('head').scrape(selector.substring(5));
        } else if (selector.substring(0, 5) == 'body.') {
            return $('body').scrape(selector.substring(5));
        } else {
            return $('html').scrape(selector);
        }
    }
}