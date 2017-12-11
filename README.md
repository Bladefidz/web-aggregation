# Scrape Query
This is simple web scraping framework that used JSON as input, so your the work flow should be loosely.

## Examples
* Go to [**example directory**](examples) for working JSON example.
* Go to [**test directory**](test) for working script example.

## Libraries
* [cheerio](https://github.com/cheeriojs/cheerio).
* [jsonframe-cheerio](https://github.com/gahabeen/jsonframe-cheerio).
* [json-query](https://github.com/mmckegg/json-query).
* [kue](https://github.com/Automattic/kue).

## Requirements
* [mongodb](https://www.mongodb.com/).
* [redis](http://redis.js.org/).

## Kue dashboard
node_modules/kue/bin/kue-dashboard -p 3050 -r redis: //127.0.0.1:3000