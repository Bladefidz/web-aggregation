const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const crawler = require('./../lib/main.js');

let jobs = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'examples', 'request.json'),
    'utf8')
);

crawler.scrape(
    jobs[0],
    function(error, response, result) {
        if (!error) {
            jsonfile.writeFileSync(
                path.join(__dirname, '..', 'examples', 'result.json'),
                result,
                {flag: 'a'},
                function (err) {
                    console.error(err)
                }
            );
        } else {
            console.log(error);
        }
    }
);