const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const output = require('./../lib/modules/output.js');
const crawler = require('./../lib/main.js');

let jobs = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'input', 'job.json'),
    'utf8')
);
let requests = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'input', 'request.json'),
    'utf8')
);

crawler.scrape(jobs, requests);