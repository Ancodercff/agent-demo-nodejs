var assert = require('assert');
var http = require('http');

function request(port) {
  http.request({
    port: port
  }, function (res) {
    assert.equal(res.statusCode, 200);
    res.pipe(process.stdout);
  }).end();
}

/**
 * assert response status code
 *
 * @param port
 */
module.exports = request;
