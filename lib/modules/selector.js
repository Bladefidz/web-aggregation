const jsonSelector = require('./selectors/json-selector');
const htmlSelector = require('./selectors/html-selector');
const postProcessor = require('./post-processor');
const fs = require('fs');
const path = require('path');

/* Module export */
module.exports = {
    run:function(response, body, selector) {
        let k;

        if (selector instanceof Object) {
            for (let key in selector) {
                let query = selector[key].split('|');
                let result;

                if (query[0].substring(0, 8) == ">Headers"){
                    // headers
                } else if (query[0].substring(0, 5) == ">Json") {
                    body = jsonSelector.select(
                        body,
                        query[0].substring(6)
                    );
                } else if (query[0].substring(0, 5) == ">Html") {
                    body = htmlSelector.select(
                        body,
                        query[0].substring(6)
                    );
                }

                if (query.length > 1) {
                    body = postProcessor.run(body, query.slice(1));
                }

                selector[key] = body;
            }
        } else if (typeof selector == "string") {
            let exe = require('../../input/scripts/' + selector);
            selector = exe.run(body);
        }

        return selector;
    }
}