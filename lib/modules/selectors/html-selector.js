const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');

module.exports = {
    select: function(data, selector) {
        let $ = cheerio.load(data);
        if (selector.substring(0, 4) == 'head') {
            return $('head').scrape(selector.substring(5));
        } else if (selector.substring(0, 4) == 'body') {
            return $('body').scrape(selector.substring(5));
        } else {
            return $('html').scrape(selector);
        }
    }
}