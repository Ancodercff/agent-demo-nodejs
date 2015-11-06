var oneapm = require('oneapm');

var express   = require('express');
var app       = express();
var async     = require( 'async' );
var redis     = require('redis').createClient();
var memcached = new (require('memcached'));
var mysql     = require('mysql');
var cql       = require( 'node-cassandra-cql' );
var mongodb;

app.use(function (req, res, next) {
  if (Math.random() > 0.5) {
    oneapm.noticeError(new Error('MyError'), {
      msg1: 'message1'
    });
  }
  next();
})

// mysql
var pool = mysql.createPool({
  host: "127.0.0.1",
  user: "travis",
  password: "",
  database: "test"
});

app.use(function (req, res, next) {
  pool.query('select 1+1 as solution', function (err, result) {
    console.log(err, result);
    next();
  })
})

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
});

// cassandra
var cqlClient = new cql.Client( { hosts: ['127.0.0.1:9042'], keyspace : 'oneapm' } );
app.use(function (req, res, next) {
  cqlClient.execute( 'SELECT * from users WHERE uid=184', function( err, result ) {
    // prepared query, optimized for the repeated query.
    async.times( 100, function( index, next ) {
      cqlClient.executeAsPrepared( 'SELECT * from users WHERE uid=184', function( err, result ) {
        next( err );
      } );
    }, function( err ) {
      if( err ) {
        console.log( err );
      }
      return next();
      // The current community version of cassandra driver doesn't implement the executeBath method, which just throw an error.
      // So just skip it for now :)
      var queries = [
        {
          query : 'INSERT INTO users (id, name) VALUES(?, ?)',
          params : [ 281, 'John' ]
        },
        {
          query : 'SELECT * from users WHERE uid=?',
          params : [ 281 ]
        }
      ];
      cqlClient.executeBatch( queries, function( err ) {
        next();
      } );

    } );
  } );
});

// externall web request
app.use(function (req, res, next) {
  require('http').request('http://static.oneapm.com/', function (r) {
    r.pipe(process.stdout);
    next();
  }).end();
})

app.get("/normal", function(req, res) {
  res.end();
});

app.get("/slow", function (req, res) {
  setTimeout( function() { // Set a timeout to make sure it's a slow transaction.
    res.end();
  }, 2100 );
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


