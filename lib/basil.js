
var async = require('async');
var urllib = require('url');
var jsdom = require('jsdom');
var http = require('http');
var urllib = require('url');
var unshortener = require('unshortener');
<<<<<<< .merge_file_1d35xi
var TwitPic = require('twitpic').TwitPic;
=======
var yfrog = require('./yfrog');
>>>>>>> .merge_file_blpXMi

var urls = function (text, callback) {
    async.filter(text.split(' '),
                 function (item, callback) {
                     callback(item.substr(0, 7) === 'http://');
                 },
                 callback);
};

var services = ['instagr.am',
                'yfrog.com',
                'yfrog.ru',
                'yfrog.com.tr',
                'yfrog.it',
                'yfrog.fr',
                'yfrog.co.il',
                'yfrog.co.uk',
                'yfrog.com.pl',
                'yfrog.pl',
                'yfrog.eu',
                'twitpic.com',
                'picplz.com'];

exports.get_pic_link = function (tweet, callback) {
    callback = callback || function () {};

    urls(tweet.text,
         function (urls) {
             async.map(urls,
                       function (item, callback) {
                           unshortener.expand(item, function (url) {
                               callback(null, url);
                           });
                       },
                       function (err, results) {
                           async.filter(results,
                                        function (item, callback) {
                                            callback(services.indexOf(
                                                item.host.replace('www.', '')) > -1);
                                        },
                                        function (results) {
                                            if (results.length > 0) {
                                                callback(results[0].href);
                                            }else{
                                                callback(null);
                                            }
                                        });
                       });
         });
};

exports.extract_pic = function (link, callback) {
    callback = callback || function () {};

    switch(urllib.parse(link).host) {
        case 'twitpic.com':
        twitpic(link, callback);
    case 'yfrog.com':
    case 'yfrog.com':
    case 'yfrog.ru':
    case 'yfrog.com.tr':
    case 'yfrog.it':
    case 'yfrog.fr':
    case 'yfrog.co.il':
    case 'yfrog.co.uk':
    case 'yfrog.com.pl':
    case 'yfrog.pl':
    case 'yfrog.eu':
        yfrog.extract(link, callback);
        break;
    default:
        callback('meow');
        //general(link, callback);
    }
};

function twitpic(url, callback) {
    url = urllib.parse(url);

    callback('http://twitpic.com/show/full'+url.pathname);
}

function general(link, callback) {
    var iterator = function (url, callback) {
        url = urllib.parse(url);

        http.request({host: url.host,
                      port: 80,
                      path: url.pathname,
                      method: 'HEAD'},
                     function (res) {
                         var size = 0;
                         if (res.headers['content-length']) {
                             size = res.headers['content-length'];
                             res.connection.destroy();
                             callback(null, -size);
                         }else{
                             res.on('data', function (chunk) {
                                 size += chunk.length;
                             });
                             res.on('end', function () {
                                 callback(null, -size);
                             });
                         }
                     }).end();
    };


    jsdom.env(link, [
        'http://code.jquery.com/jquery-1.5.min.js'
    ], function(errors, window) {
        var $ = window.$;

        var candidates = [];

        $('img').each(function () {
            candidates.push(
                urllib.resolve(link, $(this).attr('src')));
        });

        async.sortBy(candidates,
                     iterator,
                     function (err, results) {
                         callback(results[0]);
                     });
    });
}
