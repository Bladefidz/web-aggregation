"use strict";

var fs = require('fs')
    , path = require('path')
    , certFile = path.resolve(__dirname, 'ssl/client.crt')
    , keyFile = path.resolve(__dirname, 'ssl/client.key')
    , caFile = path.resolve(__dirname, 'ssl/ca.cert.pem')
    , request = require("request");

var req = {
    method: 'GET',
    url: 'https://ace.tokopedia.com/search/v1/product',
    headers: {
        "Host": "ace.tokopedia.com",
        "Accept": "application/json",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    },
    "method": "GET",
    qs: {
        "st": "product",
        "q": ">Keyword",
        "unique_id": ">Module:random.string(30)",
        "rows": 200,
        "ob": 3,
        "start": 0,
        "full_domain": "www.tokopedia.com",
        "fshop": 1,
        "page": 1,
        "scheme": "https",
        "device": "desktop",
        "source": "search",
        "callback": ""
    },
    gzip: true,
    // cert: fs.readFileSync(certFile),
    // key: fs.readFileSync(keyFile),
    // passphrase: 'password',
    // ca: fs.readFileSync(caFile)
}

request(req, function (error, response, body) {
  console.log(body);
});