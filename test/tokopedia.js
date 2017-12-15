const fs = require('fs');
const path = require('path');
const scraper = require('./../lib/main.js');

let jobs = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'examples', 'tokopedia_job.json'),
    'utf8')
);
let requestTemplates = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'examples', 'request_template.json'),
    'utf8')
);

scraper.scrape(jobs, requestTemplates);