var oneapm = require('oneapm');

var redisq = require('redisq');
var queue = redisq.queue('people');


var server = require('http').createServer(function (req, res) {
  queue.push({
    name: "jack"
  }, function () {
    res.end();
  });
});

server.listen(function () {
  setInterval(function () {
    require('../lib/client')(server.address().port);
  }, 1000)
});

//setTimeout(function () {
//  process.exit(0);
//}, 60E3)

queue.process(function () {
  console.log(arguments);
}, 1);