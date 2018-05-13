# Scrape Query
This is simple aggregation framework for web data using javascript.

## How it work?
Just think like mathematician:

```
Let:   
    X is our data, such that: {x1, x2, ..., xN}

Match:
    M(.) is our match function
    X^M is our filtered data, such that: X^M = {x | M(x) = true}
    
Projection:
    P(.) is our projection function
    X^P is our projected data, such that: X^P = P(X) = {xp1, xp2, ..., xpN}

Aggregation:
    A(.) is our aggregation function
    X^A is our aggregated data, if we want to do multiple commands such that mathc and projection. then:
        X^A = A(P(M(X)))
    or group:
        X^A = A(group(.))
```

That's all, we just need mathematics and little bit about javascript.

## Documentation
* Go to [**docs directory**](docs) for straight forward guides. 

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