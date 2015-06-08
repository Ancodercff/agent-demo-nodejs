var oneapm = require('oneapm');

var server = require('http').createServer(function (req, res) {
  res.end('ok');
});

server.listen(function () {
  setInterval(function () {
    require('../lib/client')(server.address().port);
  }, 100)
});

setTimeout(function () {
  process.exit(0);
}, 15000)

