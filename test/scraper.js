const fs = require('fs');
const path = require('path');
const scraper = require('./../lib/main.js');

let jobs = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'input', 'job.json'),
    'utf8')
);
let requests = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'input', 'request.json'),
    'utf8')
);

scraper.scrape(jobs, requests);