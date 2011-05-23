
var http = require('http');
var urllib = require('url');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

exports.extract = function (url, callback) {
    callback = callback || function () {};

    url = urllib.parse(url);

    parser.addListener('end', function (result) {
        callback(result.links.image_link);
    });

    http.get({host: 'yfrog.com',
                  path: '/api/xmlInfo?path='+url.pathname.replace('/', '')},
             function (res) {
                 var url = urllib.parse(res.headers.location);

                 http.get({host: url.hostname,
                           path: url.pathname+url.search},
                          function (res) {
                              var data = '';

                              res.on('data', function (chunk) { data += chunk; });
                              res.on('end', function () {
                                  parser.parseString(data);
                              });
                          });
             });
};
