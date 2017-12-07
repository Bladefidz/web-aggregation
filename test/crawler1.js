const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const scraper = require('./../lib/main.js');

let jobs = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'examples', 'job.json'),
    'utf8')
);
let requestTemplates = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'examples', 'request.json'),
    'utf8')
);

scraper.scrape(jobs, requestTemplates);