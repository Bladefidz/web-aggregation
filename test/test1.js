const request = require('request');

request.get({
    baseUrl: "https://www.bookabach.co.nz/baches-and-holiday-homes/search/locale",
    uri: "auckland"
}, function (err, res) {
    console.log(res.body);
});