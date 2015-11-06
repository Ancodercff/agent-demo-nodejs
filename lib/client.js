var assert = require('assert');
var http = require('http');

function request(port) {
  http.request({
    path: '/slow',
    port: port
  }, function (res) {
    assert.equal(res.statusCode, 200);
    res.pipe(process.stdout);
  }).end();


  http.request({
    path: '/normal',
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
