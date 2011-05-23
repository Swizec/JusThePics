
var basil = require('../lib/basil')
  , assert = require('assert');

var tweets = JSON.parse(require('fs').readFileSync('./test/tweets.json'));

module.exports = {
    'get_pic_link': function () {
        var services = /instagr.am|yfrog.com|twitpic.com|picplz.com|imgur.com|i.imgur.com/;

        var test = function (i) {
            basil.get_pic_link(tweets[i], function (url) {
                assert.ok(url == null || url.match(services), i+"::"+url);
            });
        };

        for (var i=0; i<tweets.length; i++) {
            test(i);
        }
    },

    'pulsene.ws': function () {
        basil.get_pic_link(tweets[32], function (url) {
            assert.ok(url === null);
        });
    },

    'extract_yfrog': function (beforeExit) {
        var fired = false;
        basil.extract_pic('http://yfrog.com/0g6i6xv3j', function (url) {
            fired = true;
            assert.equal(url,
                         'http://img16.imageshack.us/img16/733/6i6xv3.jpg');
        });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'extract_twitpic': function (beforeExit) {
        assert.fail();
        var link = 'http://twitpic.com/4xha23';

        var fired = false;

        basil.extract_pic(link, function (url) {
            assert.strictEqual(url, 'http://twitpic.com/show/full/4xha23');
            fired = true;
        });

        beforeExit(function () {
            assert.ok(fired);
        });
    },

    'extract_instagram': function () {
        assert.fail();
        var link = 'http://instagr.am/p/EQAYn/';

        basil.extract_pic(link, function (url) {
            assert.strictEqual(url, 'http://images.instagram.com/media/2011/05/14/e2edcce4a2724769920b4bd7cf7a4a38_7.jpg');
        });
    },

    'extract_random': function () {
        assert.fail();
        basil.extract_pic('http://swizec.com/blog/using-prime-numbers-to-generate-pretty-trees/swizec/1705',
                          function (url) {
                              console.log(url);
                          });
    }
};

