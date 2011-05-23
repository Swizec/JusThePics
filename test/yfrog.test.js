
var yfrog = require('../lib/yfrog')
  , assert = require('assert');


module.exports = {
    'extract_image': function (beforeExit) {
        var fired = false;
        yfrog.extract('http://yfrog.com/0g6i6xv3j',
                      function (url) {
                          fired = true;
                          assert.equal(url,
                                       'http://img16.imageshack.us/img16/733/6i6xv3.jpg');
                      });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    }
};
