var assert = require('assert');
var request = require('request');

/**
 * assert response status code
 *
 * @param port
 */
module.exports = function (port) {
  request('http://localhost:' + port, function (error, response) {
    if (error) {
      throw error;
    } else {
      assert.equal(response.statusCode, 200, 'status ok')
    }
  });
};
