var oneapm = require('oneapm');
var express = require('express');
var app = express();
var redis = require('redis').createClient();
var memcached = new (require('memcached'));
var mongodb;


// redis
app.use(function (req, res, next) {
  redis.set('hello', 'world', function (err) {
    redis.get('hello', function (err, result) {
      redis.time(function (err, result) {
        redis.del('hello', function () {
          next();
        });
      })
    })
  })
});

// memcached
app.use(function (req, res, next) {
  memcached.set('counter', "0", 0, function (err, result) {
    memcached.get('counter', function (err, result) {
      memcached.incr('counter', 1, function (err, result) {
        memcached.delete('counter', function (err, result) {
          next();
        })
      })
    })
  });
})

// mongodb
app.use(function (req, res, next) {
  var users = mongodb.collection("users");
  users.insertOne({
    name: "Jim X " + Date.now()
  }, function (err, result) {
    var p = result.ops[0];
    users.updateOne(p, {
      $set: {
        name: "www"
      }
    }, function () {
      users.removeOne({
        _id: p._id
      }, function () {
        next();
      })
    })
  });
})

app.get("/", function (req, res) {
  res.end();
});

require('mongodb').MongoClient.connect('mongodb://localhost:27017/oneapm', function (err, db) {
  mongodb = db;
  app.listen(8080, function () {
    setInterval(function () {
      require('../lib/client')(8080);
    }, 1000)
  });
});

setTimeout(function () {
  process.exit(0);
}, 60E3)

