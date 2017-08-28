const jsonSelector = require('./selectors/json-selector');
const htmlSelector = require('./selectors/html-selector');

/* Module export */
module.exports = {
    run:function(response, body, selector) {
        let k;

        for (let key in selector) {
            if (selector[key].substring(0, 8) == ">Headers"){
                // headers
            } else if (selector[key].substring(0, 5) == ">Json") {
                selector[key] = jsonSelector.select(
                    body,
                    selector[key].substring(6)
                );
            } else if (selector[key].substring(0, 5) == ">Html") {
                selector[key] = htmlSelector.select(
                    body,
                    {data: selector[key].substring(6)}
                ).data;
            } else {
                selector[key] = body;
            }
        }

        return selector;
    }
}