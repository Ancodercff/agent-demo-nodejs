var oneapm = require('oneapm');

var server = require('http').createServer(function (req, res) {
  res.end();
});

server.listen(function () {
  setInterval(function () {
    require('../lib/client')(server.address().port);
  }, 1000)
});

setTimeout(function () {
  process.exit(0);
}, 60E3)

